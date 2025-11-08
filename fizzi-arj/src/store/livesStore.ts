import { create } from "zustand";

interface LivesStore {
  lives: number;
  setLives: (count: number) => void;
  loseLife: () => void;
  resetLives: () => void;
}

export const useLivesStore = create<LivesStore>((set) => ({
  lives: 3,
  setLives: (count) => set({ lives: count }),
  loseLife: () =>
    set((state) => ({
      lives: Math.max(0, state.lives - 1),
    })),
  resetLives: () => set({ lives: 3 }),
}));
