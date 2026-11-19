import { signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc, type Unsubscribe } from 'firebase/firestore';
import { create } from 'zustand';
import {
  clampStateForCloud,
  hasProgress,
  MAX_DISPLAY_NAME_LENGTH,
  mergePersistedStates,
  statesEqual,
} from '../engine/mergeState';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { createId } from '../lib/text';
import type { PersistedState } from '../types';
import { normalizeState } from './initialState';
import { useAppStore } from './useAppStore';

export type SyncStatus = 'local' | 'syncing' | 'synced' | 'offline' | 'error';

export interface SyncConflict {
  local: PersistedState;
  remote: PersistedState;
}

interface CloudSyncStore {
  authReady: boolean;
  user: User | null;
  syncStatus: SyncStatus;
  syncError: string | null;
  fatalError: Error | null;
  lastSyncedAt: string | null;
  pendingConflict: SyncConflict | null;
  signingIn: boolean;

  signInWithGoogle: () => Promise<void>;
  signOutGoogle: () => Promise<void>;
  resolveConflict: (choice: 'merge' | 'remote' | 'local') => Promise<void>;
  syncNow: () => Promise<void>;
}

const LAST_UID_KEY = '30day-challenge:last-uid';
const DIRTY_KEY = '30day-challenge:dirty-since-sync';
const DEVICE_ID_KEY = '30day-challenge:device-id';
const SYNC_DOC_ID = 'challenge_v1';

function getDeviceId(): string {
  try {
    const existing = sessionStorage.getItem(DEVICE_ID_KEY);
    if (existing && /^[a-zA-Z0-9_-]{1,64}$/.test(existing)) return existing;
    const created = `dev_${createId()}`.slice(0, 64);
    sessionStorage.setItem(DEVICE_ID_KEY, created);
    return created;
  } catch {
    return `dev_${createId()}`.slice(0, 64);
  }
}

const DEVICE_ID = getDeviceId();

function getStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStorageItem(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors in restricted environments
  }
}

function extractPersistedState(raw: Record<string, unknown>): PersistedState {
  return normalizeState({
    schemaVersion: raw.schemaVersion as PersistedState['schemaVersion'],
    profile: raw.profile as PersistedState['profile'],
    settings: raw.settings as PersistedState['settings'],
    days: raw.days as PersistedState['days'],
    logEntries: raw.logEntries as PersistedState['logEntries'],
    repEvents: raw.repEvents as PersistedState['repEvents'],
    xpEvents: raw.xpEvents as PersistedState['xpEvents'],
    openedChests: raw.openedChests as PersistedState['openedChests'],
    unlockedBadges: raw.unlockedBadges as PersistedState['unlockedBadges'],
  });
}

function isNetworkOrOfflineError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return (
    msg.includes('unavailable') ||
    msg.includes('network') ||
    msg.includes('offline') ||
    msg.includes('failed to get document because the client is offline')
  );
}

function isPermissionError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return msg.includes('missing or insufficient permissions') || msg.includes('permission-denied');
}

let remoteDocExists = false;
let applyingRemote = false;
let reconciledUid: string | null = null;
let snapshotUnsub: Unsubscribe | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let pushQueue: Promise<void> = Promise.resolve();
let initialized = false;

export const useCloudSyncStore = create<CloudSyncStore>((set, get) => ({
  authReady: false,
  user: null,
  syncStatus: 'local',
  syncError: null,
  fatalError: null,
  lastSyncedAt: null,
  pendingConflict: null,
  signingIn: false,

  signInWithGoogle: async () => {
    set({ signingIn: true, syncError: null });
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const code = (error as { code?: string })?.code ?? '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        set({ signingIn: false });
        return;
      }
      const message =
        code === 'auth/unauthorized-domain'
          ? 'This domain is not authorized for Google Sign-In in Firebase Console yet.'
          : error instanceof Error
            ? error.message
            : 'Could not sign in with Google.';
      set({ syncError: message, syncStatus: 'error', signingIn: false });
    } finally {
      set({ signingIn: false });
    }
  },

  signOutGoogle: async () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    if (snapshotUnsub) {
      snapshotUnsub();
      snapshotUnsub = null;
    }
    remoteDocExists = false;
    reconciledUid = null;
    setStorageItem(LAST_UID_KEY, null);
    setStorageItem(DIRTY_KEY, null);
    await signOut(auth);
    set({
      user: null,
      syncStatus: 'local',
      syncError: null,
      pendingConflict: null,
      lastSyncedAt: null,
    });
  },

  resolveConflict: async (choice) => {
    const { pendingConflict, user } = get();
    if (!pendingConflict || !user) return;
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    set({ pendingConflict: null, syncStatus: 'syncing', syncError: null });

    let chosen: PersistedState;
    if (choice === 'merge') {
      chosen = mergePersistedStates(pendingConflict.local, pendingConflict.remote);
    } else if (choice === 'remote') {
      chosen = pendingConflict.remote;
    } else {
      chosen = pendingConflict.local;
    }

    applyingRemote = true;
    try {
      useAppStore.getState().applyRemoteState(chosen);
    } finally {
      applyingRemote = false;
    }

    reconciledUid = user.uid;
    setStorageItem(LAST_UID_KEY, user.uid);
    if (choice === 'remote') {
      setStorageItem(DIRTY_KEY, null);
      set({ syncStatus: 'synced', lastSyncedAt: new Date().toISOString() });
    } else {
      await enqueuePush(user.uid, chosen);
    }
    attachSnapshotListener(user.uid);
  },

  syncNow: async () => {
    const { user, pendingConflict } = get();
    if (!user || pendingConflict || reconciledUid !== user.uid) return;
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    await enqueuePush(user.uid, useAppStore.getState().data);
  },
}));

async function ensureUserAccountDoc(user: User): Promise<void> {
  const userPath = `users/${user.uid}`;
  const userRef = doc(db, 'users', user.uid);
  let snap;
  try {
    snap = await getDoc(userRef);
  } catch (error) {
    if (isNetworkOrOfflineError(error)) {
      useCloudSyncStore.setState({ syncStatus: 'offline', syncError: 'Offline — changes are saved on this device.' });
      return;
    }
    try {
      handleFirestoreError(error, OperationType.GET, userPath);
    } catch (wrapped) {
      if (isPermissionError(error)) useCloudSyncStore.setState({ fatalError: wrapped as Error });
      throw wrapped;
    }
  }

  if (!snap?.exists()) {
    const displayName = (user.displayName ?? '').slice(0, MAX_DISPLAY_NAME_LENGTH);
    try {
      await setDoc(userRef, {
        ownerId: user.uid,
        displayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      if (isNetworkOrOfflineError(error)) {
        useCloudSyncStore.setState({ syncStatus: 'offline', syncError: 'Offline — changes are saved on this device.' });
        return;
      }
      try {
        handleFirestoreError(error, OperationType.CREATE, userPath);
      } catch (wrapped) {
        if (isPermissionError(error)) useCloudSyncStore.setState({ fatalError: wrapped as Error });
        throw wrapped;
      }
    }
  }
}

function enqueuePush(uid: string, state: PersistedState): Promise<void> {
  pushQueue = pushQueue
    .catch(() => undefined)
    .then(() => pushStateToFirestore(uid, state));
  return pushQueue;
}

async function pushStateToFirestore(uid: string, state: PersistedState): Promise<void> {
  if (auth.currentUser?.uid !== uid) return;

  const syncPath = `users/${uid}/sync/${SYNC_DOC_ID}`;
  const syncRef = doc(db, 'users', uid, 'sync', SYNC_DOC_ID);
  const cleaned = clampStateForCloud(state);
  const clientUpdatedAt = new Date().toISOString();

  useCloudSyncStore.setState({ syncStatus: 'syncing', syncError: null });

  const writeUpdate = () =>
    updateDoc(syncRef, {
      profile: cleaned.profile,
      settings: cleaned.settings,
      days: cleaned.days,
      logEntries: cleaned.logEntries,
      repEvents: cleaned.repEvents,
      xpEvents: cleaned.xpEvents,
      openedChests: cleaned.openedChests,
      unlockedBadges: cleaned.unlockedBadges,
      lastDeviceId: DEVICE_ID,
      clientUpdatedAt,
      updatedAt: serverTimestamp(),
    });

  const writeCreate = () =>
    setDoc(syncRef, {
      ownerId: uid,
      schemaVersion: cleaned.schemaVersion,
      profile: cleaned.profile,
      settings: cleaned.settings,
      days: cleaned.days,
      logEntries: cleaned.logEntries,
      repEvents: cleaned.repEvents,
      xpEvents: cleaned.xpEvents,
      openedChests: cleaned.openedChests,
      unlockedBadges: cleaned.unlockedBadges,
      lastDeviceId: DEVICE_ID,
      clientUpdatedAt,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

  try {
    if (remoteDocExists) {
      try {
        await writeUpdate();
      } catch (err) {
        const code = (err as { code?: string })?.code ?? '';
        if (code === 'not-found') {
          remoteDocExists = false;
          await writeCreate();
          remoteDocExists = true;
        } else {
          throw err;
        }
      }
    } else {
      await writeCreate();
      remoteDocExists = true;
    }
    setStorageItem(DIRTY_KEY, null);
    useCloudSyncStore.setState({
      syncStatus: 'synced',
      syncError: null,
      lastSyncedAt: clientUpdatedAt,
    });
  } catch (error) {
    if (isNetworkOrOfflineError(error)) {
      setStorageItem(DIRTY_KEY, '1');
      useCloudSyncStore.setState({
        syncStatus: 'offline',
        syncError: 'Offline — progress is saved locally and will sync when online.',
      });
      return;
    }
    try {
      handleFirestoreError(error, remoteDocExists ? OperationType.UPDATE : OperationType.CREATE, syncPath);
    } catch (wrapped) {
      const errObj = wrapped as Error;
      if (isPermissionError(error)) {
        useCloudSyncStore.setState({ fatalError: errObj, syncStatus: 'error', syncError: 'Sync permission error.' });
      } else {
        useCloudSyncStore.setState({ syncStatus: 'error', syncError: 'Could not sync to cloud.' });
      }
    }
  }
}

function attachSnapshotListener(uid: string): void {
  if (snapshotUnsub) {
    snapshotUnsub();
    snapshotUnsub = null;
  }

  const syncPath = `users/${uid}/sync/${SYNC_DOC_ID}`;
  const syncRef = doc(db, 'users', uid, 'sync', SYNC_DOC_ID);

  snapshotUnsub = onSnapshot(
    syncRef,
    (snapshot) => {
      if (!snapshot.exists()) return;
      remoteDocExists = true;
      const raw = snapshot.data();
      if (raw.lastDeviceId === DEVICE_ID) return;

      const remoteState = extractPersistedState(raw);
      const localState = useAppStore.getState().data;
      if (!statesEqual(localState, remoteState)) {
        applyingRemote = true;
        try {
          useAppStore.getState().applyRemoteState(remoteState);
        } finally {
          applyingRemote = false;
        }
      }
      setStorageItem(DIRTY_KEY, null);
      useCloudSyncStore.setState({
        syncStatus: 'synced',
        syncError: null,
        lastSyncedAt: typeof raw.clientUpdatedAt === 'string' ? raw.clientUpdatedAt : new Date().toISOString(),
      });
    },
    (error) => {
      if (isNetworkOrOfflineError(error)) {
        useCloudSyncStore.setState({ syncStatus: 'offline' });
        return;
      }
      try {
        handleFirestoreError(error, OperationType.GET, syncPath);
      } catch (wrapped) {
        if (isPermissionError(error)) {
          useCloudSyncStore.setState({ fatalError: wrapped as Error, syncStatus: 'error' });
        }
      }
    },
  );
}

async function waitForStoreHydration(): Promise<void> {
  if (useAppStore.getState().hydrated) return;
  await new Promise<void>((resolve) => {
    const unsub = useAppStore.subscribe((state) => {
      if (state.hydrated) {
        unsub();
        resolve();
      }
    });
  });
}

async function reconcileUserOnSignIn(user: User): Promise<void> {
  reconciledUid = null;
  useCloudSyncStore.setState({ syncStatus: 'syncing', syncError: null, pendingConflict: null });
  await waitForStoreHydration();
  if (auth.currentUser?.uid !== user.uid) return;

  await ensureUserAccountDoc(user);
  if (useCloudSyncStore.getState().syncStatus === 'offline' || auth.currentUser?.uid !== user.uid) return;

  const syncPath = `users/${user.uid}/sync/${SYNC_DOC_ID}`;
  const syncRef = doc(db, 'users', user.uid, 'sync', SYNC_DOC_ID);

  let syncSnap;
  try {
    syncSnap = await getDoc(syncRef);
  } catch (error) {
    if (isNetworkOrOfflineError(error)) {
      useCloudSyncStore.setState({ syncStatus: 'offline', syncError: 'Offline — changes are saved on this device.' });
      return;
    }
    try {
      handleFirestoreError(error, OperationType.GET, syncPath);
    } catch (wrapped) {
      if (isPermissionError(error)) {
        useCloudSyncStore.setState({ fatalError: wrapped as Error, syncStatus: 'error' });
      }
      return;
    }
  }

  if (auth.currentUser?.uid !== user.uid) return;

  let localState = useAppStore.getState().data;
  const lastUid = getStorageItem(LAST_UID_KEY);
  const dirtySinceSync = getStorageItem(DIRTY_KEY) === '1';

  if (!syncSnap?.exists()) {
    remoteDocExists = false;
    if (!localState.profile.displayName && user.displayName) {
      applyingRemote = true;
      try {
        useAppStore.getState().setDisplayName(user.displayName.slice(0, MAX_DISPLAY_NAME_LENGTH));
      } finally {
        applyingRemote = false;
      }
      localState = useAppStore.getState().data;
    }
    setStorageItem(LAST_UID_KEY, user.uid);
    reconciledUid = user.uid;
    await enqueuePush(user.uid, localState);
    attachSnapshotListener(user.uid);
    return;
  }

  remoteDocExists = true;
  const remoteState = extractPersistedState(syncSnap.data());

  if (lastUid === user.uid) {
    reconciledUid = user.uid;
    if (dirtySinceSync && !statesEqual(localState, remoteState)) {
      const merged = mergePersistedStates(localState, remoteState);
      applyingRemote = true;
      try {
        useAppStore.getState().applyRemoteState(merged);
      } finally {
        applyingRemote = false;
      }
      await enqueuePush(user.uid, merged);
    } else if (!statesEqual(localState, remoteState)) {
      applyingRemote = true;
      try {
        useAppStore.getState().applyRemoteState(remoteState);
      } finally {
        applyingRemote = false;
      }
      setStorageItem(DIRTY_KEY, null);
      useCloudSyncStore.setState({ syncStatus: 'synced', lastSyncedAt: new Date().toISOString() });
    } else {
      setStorageItem(DIRTY_KEY, null);
      useCloudSyncStore.setState({ syncStatus: 'synced', lastSyncedAt: new Date().toISOString() });
    }
    attachSnapshotListener(user.uid);
    return;
  }

  // First time signing into this UID on this browser (or switching accounts)
  if (!hasProgress(localState) || statesEqual(localState, remoteState)) {
    applyingRemote = true;
    try {
      useAppStore.getState().applyRemoteState(remoteState);
    } finally {
      applyingRemote = false;
    }
    reconciledUid = user.uid;
    setStorageItem(LAST_UID_KEY, user.uid);
    setStorageItem(DIRTY_KEY, null);
    useCloudSyncStore.setState({ syncStatus: 'synced', lastSyncedAt: new Date().toISOString() });
    attachSnapshotListener(user.uid);
    return;
  }

  // Both local device and cloud account have distinct progress — ask user how to reconcile.
  useCloudSyncStore.setState({
    syncStatus: 'local',
    pendingConflict: { local: localState, remote: remoteState },
  });
}

function schedulePush(): void {
  const { user, pendingConflict } = useCloudSyncStore.getState();
  if (!user || pendingConflict) return;

  setStorageItem(DIRTY_KEY, '1');
  if (reconciledUid !== user.uid) return;

  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    const currentUser = useCloudSyncStore.getState().user;
    if (currentUser && reconciledUid === currentUser.uid && !useCloudSyncStore.getState().pendingConflict) {
      void enqueuePush(currentUser.uid, useAppStore.getState().data);
    }
  }, 500);
}

export function initCloudSync(): () => void {
  if (initialized) return () => undefined;
  initialized = true;

  const unsubStore = useAppStore.subscribe((state, prevState) => {
    if (!state.hydrated || applyingRemote) return;
    if (state.data !== prevState.data) {
      schedulePush();
    }
  });

  const flushIfPending = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
      const { user, pendingConflict } = useCloudSyncStore.getState();
      if (user && reconciledUid === user.uid && !pendingConflict) {
        void enqueuePush(user.uid, useAppStore.getState().data);
      }
    }
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') flushIfPending();
  };

  window.addEventListener('pagehide', flushIfPending);
  document.addEventListener('visibilitychange', onVisibilityChange);

  const unsubAuth = onAuthStateChanged(auth, (user) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    if (snapshotUnsub) {
      snapshotUnsub();
      snapshotUnsub = null;
    }
    remoteDocExists = false;
    reconciledUid = null;
    useCloudSyncStore.setState({ authReady: true, user });

    if (!user) {
      useCloudSyncStore.setState({ syncStatus: 'local', syncError: null, pendingConflict: null });
      return;
    }

    void reconcileUserOnSignIn(user);
  });

  return () => {
    unsubStore();
    unsubAuth();
    if (snapshotUnsub) snapshotUnsub();
    window.removeEventListener('pagehide', flushIfPending);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    initialized = false;
  };
}
