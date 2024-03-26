import { RootState } from "@/src/store";
import { createSlice } from "@reduxjs/toolkit";

interface VirtualEstateSlice {
  showInitialMapAnimation: true;

  myVirtualEstatesCount: number;

  shouldRefreshListings: boolean;
}

const initialState: VirtualEstateSlice = {
  showInitialMapAnimation: true,
  myVirtualEstatesCount: 0,
  shouldRefreshListings: false,
};

export const virtualEstatelSlice = createSlice({
  name: "virtualEstate",
  initialState,
  reducers: {
    setInitialMapAnimation: (state, action) => {
      state.showInitialMapAnimation = action.payload;
    },
    setMyVirtualEstatesCount: (state, action) => {
      state.myVirtualEstatesCount = action.payload;
    },

    signalRefreshListings: (state) => {
      state.shouldRefreshListings = !state.shouldRefreshListings;
    },
  },
});

export const {
  setInitialMapAnimation,
  setMyVirtualEstatesCount,
  signalRefreshListings,
} = virtualEstatelSlice.actions;

export const showInitialMapAnimationValue = (state: RootState) =>
  state.virtualEstate.showInitialMapAnimation;
export const myVirtualEstatesCountValue = (state: RootState) =>
  state.virtualEstate.myVirtualEstatesCount;

export const shouldRefreshListingsValue = (state: RootState) =>
  state.virtualEstate.shouldRefreshListings;

export default virtualEstatelSlice;
