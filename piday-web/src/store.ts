import { configureStore } from "@reduxjs/toolkit";

import { accountRTKApi } from "./features/account/api/accountAPI";
import { authRTKApi } from "./features/auth/api/authAPI";
import globalSlice from "./features/global/global.slice";
import { mapboxRTKApi } from "./features/virtual-estate/api/mapboxAPI";
import { virtualEstateRTKApi } from "./features/virtual-estate/api/virtualEstateAPI";
import virtualEstatelSlice from "./features/virtual-estate/virtual-estate-slice";

export const store = configureStore({
  reducer: {
    [globalSlice.name]: globalSlice.reducer,
    [virtualEstatelSlice.name]: virtualEstatelSlice.reducer,

    [authRTKApi.reducerPath]: authRTKApi.reducer,
    [accountRTKApi.reducerPath]: accountRTKApi.reducer,
    [mapboxRTKApi.reducerPath]: mapboxRTKApi.reducer,
    [virtualEstateRTKApi.reducerPath]: virtualEstateRTKApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(authRTKApi.middleware)
      .concat(accountRTKApi.middleware)
      .concat(mapboxRTKApi.middleware)
      .concat(virtualEstateRTKApi.middleware);
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
