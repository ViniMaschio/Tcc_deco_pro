import { create } from "zustand";

type PaginationStore = {
  perPage?: number;
  changePerPage: (value: number) => void;
};

export const usePaginationStore = create<PaginationStore>((set) => ({
  perPage: 15,
  changePerPage: (value) => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    set({ perPage: value });
  },
}));
