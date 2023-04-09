import { configureStore } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import usersReducer from "../stores/users/slice";

export const store = configureStore({
  reducer: usersReducer,
  middleware: [thunkMiddleware],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
