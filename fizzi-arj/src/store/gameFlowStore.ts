import { create } from "zustand";

interface GameFlowState {
  shouldScrollToRules: boolean;
  scrollLocked: boolean;
  triggerScrollToRules: () => void;
  lockScroll: () => void;
  unlockScroll: () => void;
  reset: () => void;
}

export const useGameFlowStore = create<GameFlowState>((set) => ({
  shouldScrollToRules: false,
  scrollLocked: false,
  triggerScrollToRules: () => set({ shouldScrollToRules: true }),
  lockScroll: () => set({ scrollLocked: true }),
  unlockScroll: () => set({ scrollLocked: false }),
  reset: () => set({ shouldScrollToRules: false, scrollLocked: false }),
}));
