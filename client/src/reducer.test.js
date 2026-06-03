import { describe, it, expect } from 'vitest';
import reducer from './reducer';

const base = {
  currentUser: null,
  idToken: null,
  isAuth: false,
  draft: null,
  pins: [],
  currentPin: null,
};

describe('reducer', () => {
  it('SIGNOUT_USER clears auth state', () => {
    const state = {
      ...base,
      currentUser: { _id: '1' },
      idToken: 'token',
      isAuth: true,
    };
    const next = reducer(state, { type: 'SIGNOUT_USER' });
    expect(next.isAuth).toBe(false);
    expect(next.idToken).toBeNull();
    expect(next.currentUser).toBeNull();
  });

  it('CREATE_PIN adds pin without duplicates', () => {
    const pin = { _id: 'a', title: 'Spot' };
    const state = { ...base, pins: [pin] };
    const next = reducer(state, { type: 'CREATE_PIN', payload: pin });
    expect(next.pins).toHaveLength(1);
  });
});
