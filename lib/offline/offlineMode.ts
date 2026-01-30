/**
 * Offline Mode Management
 * Allows users to use Fast Mode without authentication
 */

const OFFLINE_MODE_KEY = 'signland-offline-mode';
const OFFLINE_USER_KEY = 'signland-offline-user';

export function enableOfflineMode(username?: string) {
  localStorage.setItem(OFFLINE_MODE_KEY, 'true');
  if (username) {
    localStorage.setItem(OFFLINE_USER_KEY, username);
  }
}

export function disableOfflineMode() {
  localStorage.removeItem(OFFLINE_MODE_KEY);
}

export function isOfflineMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(OFFLINE_MODE_KEY) === 'true';
}

export function getOfflineUser(): string {
  if (typeof window === 'undefined') return 'Guest';
  return localStorage.getItem(OFFLINE_USER_KEY) || 'Guest User';
}

export function isOnline(): boolean {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
}
