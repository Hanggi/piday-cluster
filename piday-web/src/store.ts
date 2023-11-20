import { configureStore } from "@reduxjs/toolkit";

import { authRTKApi } from "./features/auth/api/authAPI";

export const store = configureStore({
  reducer: {
    [authRTKApi.reducerPath]: authRTKApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(authRTKApi.middleware);
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
