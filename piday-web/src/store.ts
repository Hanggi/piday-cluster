import { configureStore } from "@reduxjs/toolkit";

import { accountRTKApi } from "./features/account/api/accountAPI";
import { transactionAdminAPI } from "./features/admin/transactions/transaction-admin-api";
import { userAdminAPI } from "./features/admin/users/user-admin-api";
import { virtualEstatesAdminAPI } from "./features/admin/vritual-estates/virtual-estates-admin-api";
import { withdrawRequestAdminAPI } from "./features/admin/withdraw-requests/withdraw-requests-api";
import { authRTKApi } from "./features/auth/api/authAPI";
import globalSlice from "./features/global/global.slice";
import { leaderboardAPI } from "./features/leaderboard/api/leaderboardAPI";
import { pointRTKApi } from "./features/point/api/pointAPI";
import { userRTKAPI } from "./features/user/api/userAPI";
import userSlice from "./features/user/user-slice";
import { virtualEstateListingRTKApi } from "./features/virtual-estate-listing/api/virtualEstateListingAPI";
import { virtualEstateTransactionRecordsRTKApi } from "./features/virtual-estate-transaction-record/api/virtualEstateTransactionRecordAPI";
import { mapboxRTKApi } from "./features/virtual-estate/api/mapboxAPI";
import { virtualEstateRTKApi } from "./features/virtual-estate/api/virtualEstateAPI";
import virtualEstatelSlice from "./features/virtual-estate/virtual-estate-slice";
import { withdrawRequestRTKApi } from "./features/withdraw/api/withdrawAPI";

export const store = configureStore({
  reducer: {
    [globalSlice.name]: globalSlice.reducer,
    [virtualEstatelSlice.name]: virtualEstatelSlice.reducer,
    [userSlice.name]: userSlice.reducer,

    [authRTKApi.reducerPath]: authRTKApi.reducer,
    [accountRTKApi.reducerPath]: accountRTKApi.reducer,
    [mapboxRTKApi.reducerPath]: mapboxRTKApi.reducer,
    [virtualEstateRTKApi.reducerPath]: virtualEstateRTKApi.reducer,
    [virtualEstateListingRTKApi.reducerPath]:
      virtualEstateListingRTKApi.reducer,
    [virtualEstateTransactionRecordsRTKApi.reducerPath]:
      virtualEstateTransactionRecordsRTKApi.reducer,
    [userRTKAPI.reducerPath]: userRTKAPI.reducer,
    [pointRTKApi.reducerPath]: pointRTKApi.reducer,

    // Admin
    [virtualEstatesAdminAPI.reducerPath]: virtualEstatesAdminAPI.reducer,
    [transactionAdminAPI.reducerPath]: transactionAdminAPI.reducer,
    [withdrawRequestRTKApi.reducerPath]: withdrawRequestRTKApi.reducer,
    [userAdminAPI.reducerPath]: userAdminAPI.reducer,
    [withdrawRequestAdminAPI.reducerPath]: withdrawRequestAdminAPI.reducer,
    [leaderboardAPI.reducerPath]: leaderboardAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(authRTKApi.middleware)
      .concat(accountRTKApi.middleware)
      .concat(mapboxRTKApi.middleware)
      .concat(virtualEstateRTKApi.middleware)
      .concat(virtualEstateListingRTKApi.middleware)
      .concat(virtualEstateTransactionRecordsRTKApi.middleware)
      .concat(userRTKAPI.middleware)
      .concat(virtualEstatesAdminAPI.middleware)
      .concat(transactionAdminAPI.middleware)
      .concat(withdrawRequestRTKApi.middleware)
      .concat(pointRTKApi.middleware)
      .concat(userAdminAPI.middleware)
      .concat(withdrawRequestAdminAPI.middleware)
      .concat(leaderboardAPI.middleware);
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
