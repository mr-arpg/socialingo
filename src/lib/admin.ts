import { useSyncExternalStore } from 'react';

const KEY = '30day-challenge:admin';
const listeners = new Set<() => void>();

function read(): boolean {
  return localStorage.getItem(KEY) === '1';
}

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function setAdminUnlock(on: boolean): void {
  localStorage.setItem(KEY, on ? '1' : '0');
  emit();
}

export function useAdminUnlock(): boolean {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    read,
  );
}
