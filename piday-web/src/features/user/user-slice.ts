import { RootState } from "@/src/store";
import { createSlice } from "@reduxjs/toolkit";

import { authRTKApi } from "../auth/api/authAPI";
import { User } from "../auth/interface/User.interface";

interface UserSlice {
  myUser?: User;
}

const initialState: UserSlice = {
  myUser: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.myUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authRTKApi.endpoints.getMyUser.matchFulfilled,
      (state, { payload }) => {
        state.myUser = {
          ...state.myUser,
          ...payload,
        };
      },
    );
  },
});

export const { setUser: setMyUser } = userSlice.actions;

export const myUserValue = (state: RootState) => state.user.myUser;

export default userSlice;
