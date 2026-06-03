import { create } from 'zustand';

import { getStoredToken } from '../utils/authStorage';

export const useAppStore = create((set) => ({
  currentUser: null,
  idToken: getStoredToken(),
  isAuth: false,
  authDialogOpen: false,
  draft: null,
  pins: [],
  currentPin: null,

  setAuthSession: ({ token, user }) =>
    set({
      idToken: token,
      currentUser: user,
      isAuth: true,
    }),

  signOut: () =>
    set({
      currentUser: null,
      idToken: null,
      isAuth: false,
      draft: null,
      currentPin: null,
    }),

  openAuthDialog: () => set({ authDialogOpen: true }),
  closeAuthDialog: () => set({ authDialogOpen: false }),

  createDraft: () =>
    set({
      draft: { latitude: 0, longitude: 0 },
      currentPin: null,
    }),

  updateDraftLocation: (location) => set({ draft: location }),

  deleteDraft: () => set({ draft: null }),

  setPins: (pins) => set({ pins }),

  addPin: (pin) =>
    set((state) => ({
      pins: [...state.pins.filter((p) => p._id !== pin._id), pin],
    })),

  setCurrentPin: (pin) => set({ currentPin: pin, draft: null }),

  deletePin: (deletedPin) =>
    set((state) => {
      const pins = state.pins.filter((p) => p._id !== deletedPin._id);
      const currentPin =
        state.currentPin?._id === deletedPin._id ? null : state.currentPin;
      return { pins, currentPin };
    }),

  updatePin: (updatedPin) =>
    set((state) => ({
      pins: state.pins.map((p) => (p._id === updatedPin._id ? updatedPin : p)),
      currentPin:
        state.currentPin?._id === updatedPin._id ? updatedPin : state.currentPin,
    })),
}));
