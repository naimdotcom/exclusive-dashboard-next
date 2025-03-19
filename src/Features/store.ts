import { configureStore } from "@reduxjs/toolkit";
import exclusiveApi from "./api/Exclusive";
// ...

export const store = configureStore({
  reducer: {
    [exclusiveApi.reducerPath]: exclusiveApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(exclusiveApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
