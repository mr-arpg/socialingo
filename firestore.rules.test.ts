// Reference Rules Unit Test Suite for the Dirty Dozen Payloads
// Run with Firebase Emulator Suite + @firebase/rules-unit-testing
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, getDocs, collection, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { readFileSync } from 'node:fs';

async function runDirtyDozenSuite() {
  const testEnv = await initializeTestEnvironment({
    projectId: 'encoded-bebop-r5fd2',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  });

  const unauthDb = testEnv.unauthenticatedContext().firestore();
  const unverifiedDb = testEnv.authenticatedContext('userA', { email_verified: false }).firestore();
  const userADb = testEnv.authenticatedContext('userA', { email_verified: true }).firestore();
  const userBDb = testEnv.authenticatedContext('userB', { email_verified: true }).firestore();

  const validAccount = {
    ownerId: 'userA',
    displayName: 'Alex',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const validSync = {
    ownerId: 'userA',
    schemaVersion: 1,
    profile: { displayName: 'Alex', createdAt: '2026-11-18T00:00:00.000Z' },
    settings: { theme: 'system', sound: true, haptics: true, motion: 'system' },
    days: {},
    logEntries: {},
    repEvents: [],
    xpEvents: [],
    openedChests: [],
    unlockedBadges: {},
    lastDeviceId: 'dev_1',
    clientUpdatedAt: '2026-11-18T00:00:00.000Z',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await assertSucceeds(setDoc(doc(userADb, 'users/userA'), validAccount));
  await assertSucceeds(setDoc(doc(userADb, 'users/userA/sync/challenge_v1'), validSync));

  // 1. Unauthenticated read
  await assertFails(getDoc(doc(unauthDb, 'users/userA/sync/challenge_v1')));
  // 2. Unverified email write
  await assertFails(setDoc(doc(unverifiedDb, 'users/userA'), validAccount));
  // 3. Cross-user read
  await assertFails(getDoc(doc(userBDb, 'users/userA/sync/challenge_v1')));
  // 4. Identity spoofing
  await assertFails(setDoc(doc(userADb, 'users/userA'), { ...validAccount, ownerId: 'userB' }));
  // 5. Shadow field injection
  await assertFails(setDoc(doc(userADb, 'users/userA/sync/challenge_v1'), { ...validSync, isAdmin: true }));
  // 6. Client timestamp forgery
  await assertFails(setDoc(doc(userADb, 'users/userA'), { ...validAccount, createdAt: new Date(0) }));
  // 7. Immutable field mutation
  await assertFails(updateDoc(doc(userADb, 'users/userA/sync/challenge_v1'), { ownerId: 'userB', updatedAt: serverTimestamp() }));
  // 8. Arbitrary sync doc ID
  await assertFails(setDoc(doc(userADb, 'users/userA/sync/other_doc'), validSync));
  // 9. Oversized displayName
  await assertFails(
    updateDoc(doc(userADb, 'users/userA/sync/challenge_v1'), {
      profile: { displayName: 'x'.repeat(101), createdAt: '2026-11-18T00:00:00.000Z' },
      updatedAt: serverTimestamp(),
    }),
  );
  // 10. Invalid theme enum
  await assertFails(
    updateDoc(doc(userADb, 'users/userA/sync/challenge_v1'), {
      settings: { theme: 'neon', sound: true, haptics: true, motion: 'system' },
      updatedAt: serverTimestamp(),
    }),
  );
  // 11. Array type poisoning
  await assertFails(
    updateDoc(doc(userADb, 'users/userA/sync/challenge_v1'), {
      repEvents: ['bad'],
      updatedAt: serverTimestamp(),
    }),
  );
  // 12. Blanket collection list
  await assertFails(getDocs(collection(userADb, 'users')));

  await testEnv.cleanup();
}

export { runDirtyDozenSuite };
