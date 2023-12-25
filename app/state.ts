import { create } from "zustand";
interface FormStore {
  names: string[];
  setNames: (names: string[]) => void;
  total: number;
  setTotal: (total: number) => void;
  paidBy: string;
  setPaidBy: (paidBy: string) => void;
  items: { price: number; sharedBy: string[] }[];
  setItems: (items: { price: number; sharedBy: string[] }[]) => void;
}
export const useFormStore = create<FormStore>((set) => ({
  names: [],
  setNames: (names: string[]) => set({ names }),
  total: 0,
  setTotal: (total: number) => set({ total }),
  paidBy: "",
  setPaidBy: (paidBy: string) => set({ paidBy }),
  items: [],
  setItems: (items: { price: number; sharedBy: string[] }[]) => set({ items }),
}));
