import React, { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usersRemainingSelector } from "./selector";
import { fetchUsersThunk } from "./thunk";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Box, CircularProgress } from "@mui/material";
import { AppDispatch } from "../../app/store";

function Users() {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector(usersRemainingSelector);

  // useEffect(() => {
  //   dispatch(fetchUsersThunk());
  // }, [dispatch]);

  const handleFetchData = () => {
    dispatch(fetchUsersThunk());
  };

  console.log(users);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 90,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
  ];

  return (
    <div>
      <button onClick={handleFetchData}>Fetch Data</button>
      <div style={{ height: 400, width: "100%" }}>
        {users.isLoading ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={users.data === null ? [] : users?.data}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        )}
      </div>
    </div>
  );
}

export default Users;
