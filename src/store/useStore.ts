import { create } from "zustand";

interface NollyState {
  address: string | null;
  fid: number | null;
  isLoading: boolean;
  setAddress: (addr: string | null) => void;
  setFid: (id: number | null) => void;
  setLoading: (status: boolean) => void;
}

export const useStore = create<NollyState>((set) => ({
  address: null,
  fid: null,
  isLoading: false,
  setAddress: (addr) => set({ address: addr }),
  setFid: (id) => set({ fid: id }),
  setLoading: (status) => set({ isLoading: status }),
}));
