import { RootState } from "@/src/store";
import { createSlice } from "@reduxjs/toolkit";

interface VirtualEstateSlice {
  showInitialMapAnimation: true;

  myVirtualEstatesCount: number;
}

const initialState: VirtualEstateSlice = {
  showInitialMapAnimation: true,
  myVirtualEstatesCount: 0,
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
  },
});

export const { setInitialMapAnimation, setMyVirtualEstatesCount } =
  virtualEstatelSlice.actions;

export const showInitialMapAnimationValue = (state: RootState) =>
  state.virtualEstate.showInitialMapAnimation;
export const myVirtualEstatesCountValue = (state: RootState) =>
  state.virtualEstate.myVirtualEstatesCount;

export default virtualEstatelSlice;
