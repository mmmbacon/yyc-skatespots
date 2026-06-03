import { setStoredToken, clearStoredToken } from './authStorage';
import { useAppStore } from '../stores/useAppStore';

export function applyAuthSession({ token, user }) {
  setStoredToken(token);
  useAppStore.getState().setAuthSession({ token, user });
}

export function signOutUser() {
  clearStoredToken();
  useAppStore.getState().signOut();
}
