import { createSlice } from "@reduxjs/toolkit";

interface GlobalSlice {
  serverSideEnv: { [key: string]: any };
}

const initialState: GlobalSlice = {
  serverSideEnv: {},
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setServerSideEnv: (state, action) => {
      state.serverSideEnv = process.env;
    },
  },
});

export const {} = globalSlice.actions;

export default globalSlice;
