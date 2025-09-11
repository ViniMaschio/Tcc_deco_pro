import { create } from "zustand";

type SidebarStore = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
}));
