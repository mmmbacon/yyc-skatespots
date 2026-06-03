import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      currentUser: null,
      idToken: null,
      isAuth: false,
      authDialogOpen: false,
      draft: null,
      pins: [],
      currentPin: null,
    });
  });

  it('signOut clears auth state', () => {
    useAppStore.setState({
      currentUser: { _id: '1' },
      idToken: 'token',
      isAuth: true,
    });
    useAppStore.getState().signOut();
    const state = useAppStore.getState();
    expect(state.isAuth).toBe(false);
    expect(state.idToken).toBeNull();
    expect(state.currentUser).toBeNull();
  });

  it('addPin adds pin without duplicates', () => {
    const pin = { _id: 'a', title: 'Spot' };
    useAppStore.setState({ pins: [pin] });
    useAppStore.getState().addPin(pin);
    expect(useAppStore.getState().pins).toHaveLength(1);
  });
});
