import { RootState } from "@/src/store";
import { createSlice } from "@reduxjs/toolkit";

interface VirtualEstateSlice {
  showInitialMapAnimation: true;
}

const initialState: VirtualEstateSlice = {
  showInitialMapAnimation: true,
};

export const virtualEstatelSlice = createSlice({
  name: "virtualEstate",
  initialState,
  reducers: {
    setInitialMapAnimation: (state, action) => {
      state.showInitialMapAnimation = action.payload;
    },
  },
});

export const { setInitialMapAnimation } = virtualEstatelSlice.actions;

export const showInitialMapAnimationValue = (state: RootState) =>
  state.virtualEstate.showInitialMapAnimation;

export default virtualEstatelSlice;
