/**
createSelector cho phép bạn tạo  ra các selector kết hợp từ nhiều selector
 khác nhau. Các selector này được kết hợp lại để tính toán ra giá trị cuối cùng.
 */

import { createSelector } from "reselect";
import { UsersState } from "../../types/typeUsers";

export const dataSelector = (state: UsersState) => state.data;
export const isLoadingSelector = (state: UsersState) => state.isLoading;
export const errorSelector = (state: UsersState) => state.error;

export const usersRemainingSelector = createSelector(
  dataSelector,
  isLoadingSelector,
  errorSelector,
  (data, isLoading, error) => {
    return { data, isLoading, error }
  }
);
