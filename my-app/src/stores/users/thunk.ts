import { AsyncThunkAction, createAsyncThunk } from "@reduxjs/toolkit";
import ApiService from "../../services/api";
import { RootState } from "../../app/store";

export const fetchUsersThunk = createAsyncThunk(
  "users/fetchUsersThunk",
  async () => {
    const data = await ApiService.getUsers();
    console.log("data", data);
    return data;
  }
);

export const getUsersThunk = createAsyncThunk("users/getUsersThunk", () => {});
