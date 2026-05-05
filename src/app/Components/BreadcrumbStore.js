import { create } from 'zustand';

export const useBreadcrumbStore = create((set) => ({
  segments: [],
  setSegments: (segments) =>
    set({ segments }),
  clearSegments: () =>
    set({ segments: [] }),
}));
