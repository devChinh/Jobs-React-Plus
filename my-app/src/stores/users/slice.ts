import { createSlice } from "@reduxjs/toolkit";
import { UsersState } from "../../types/typeUsers";
import { fetchUsersThunk } from "./thunk";

const initialState: UsersState = {
  data: null,
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsersThunk.pending, (state) => {
      state.data = null;
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(fetchUsersThunk.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
    });

    builder.addCase(fetchUsersThunk.rejected, (state, action) => {
      state.data = null;
      state.isLoading = true;
      state.error = action.payload;
    });
  },
});

// export const { fetchDataStart, fetchDataSuccess, fetchDataError } =
//   usersSlice.actions;
export default usersSlice.reducer;
