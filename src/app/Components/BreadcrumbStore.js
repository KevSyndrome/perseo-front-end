import { create } from 'zustand';

const ROOT_SEGMENT = { label: 'Dashboard', path: '/' };

export const useBreadcrumbStore = create((set) => ({
  segments: [ROOT_SEGMENT],
  pushSegment: (segment) =>
    set((state) => ({
      segments: [ROOT_SEGMENT, ...state.segments.slice(1), segment],
    })),
  popSegment: () =>
    set((state) => ({
      segments: state.segments.length > 1 ? state.segments.slice(0, -1) : [ROOT_SEGMENT],
    })),
  setSegments: (segments) =>
    set({ segments: [ROOT_SEGMENT, ...segments] }),
  clearSegments: () =>
    set({ segments: [ROOT_SEGMENT] }),
}));
