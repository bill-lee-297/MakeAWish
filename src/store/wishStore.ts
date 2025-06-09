import { create } from 'zustand';

interface WishState {
  showWishList: boolean;
  setShowWishList: (show: boolean) => void;
}

export const useWishStore = create<WishState>((set) => ({
  showWishList: false,
  setShowWishList: (show) => set({ showWishList: show }),
})); 