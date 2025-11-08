import { create } from "zustand";

interface HighScoreStore {
  score: number;
  setScore: (score: number) => void;
  resetScore: () => void;
}

export const useScoreStore = create<HighScoreStore>((set) => ({
  score: 0,
  setScore: (myScore) => set({ score: myScore }),
  resetScore: () => set({ score: 0 }),
}));
