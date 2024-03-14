import { RootState } from "@/src/store";
import { createSlice } from "@reduxjs/toolkit";

import { accountRTKApi } from "../account/api/accountAPI";
import { authRTKApi } from "../auth/api/authAPI";
import { User } from "../auth/interface/User.interface";

interface UserSlice {
  myUser?: User;
  myBalance: number;
}

const initialState: UserSlice = {
  myUser: undefined,
  myBalance: 0,
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
    builder.addMatcher(
      accountRTKApi.endpoints.getBalance.matchFulfilled,
      (state, { payload }) => {
        state.myBalance = payload;
      },
    );
  },
});

export const { setUser: setMyUser } = userSlice.actions;

export const myUserValue = (state: RootState) => state.user.myUser;
export const myBalanceValue = (state: RootState) => state.user.myBalance;

export default userSlice;
