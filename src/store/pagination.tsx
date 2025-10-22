import { create } from "zustand";

interface PaginationState {
  perPage: number;
  changePerPage: (perPage: number) => void;
}

export const usePaginationStore = create<PaginationState>((set) => ({
  perPage: 15,
  changePerPage: (perPage: number) => set({ perPage }),
}));
