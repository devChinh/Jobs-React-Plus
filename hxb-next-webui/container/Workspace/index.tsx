import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

import { useFormik } from "formik";
import { useTranslation } from "next-i18next";
import { useSetRecoilState } from "recoil";

import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

import ModalArchive from "../../components/modal/archiveModal";
import MenuMoreVert from "../../components/modal/menuMoreVert";
import ModalSetting from "../../components/modal/modalSetting";
import DashboardLayout from "../../container/DashboardLayout";
import { StyledTableCell } from "../../container/Workspace/style";
import {
  ADD_WORKSPACE,
  SET_CURRENT_WORKSPACE_MUTATION,
  WORKSPACES_QUERY,
} from "../../graphql/workspace";
import { notificationState } from "../../recoil/atom/workspace";
import { TWorkspace, TWorkspaces } from "../../recoil/atom/workspace/types";

const WorkSpaceContainer: React.FC<{}> = () => {
  const { t } = useTranslation("workspace");

  const setNotification = useSetRecoilState(notificationState);

  const [workspaces, setWorkspaces] = useState<TWorkspace[]>([]);
  const [displayedWorkspaces, setDisplayedWorkspaces] = useState<TWorkspace[]>(
    []
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<
    string | null | undefined
  >();
  const { push: routerPush } = useRouter();
  const [setCurrentWorkspace, { error, loading }] = useMutation(
    SET_CURRENT_WORKSPACE_MUTATION
  );
  const [addWorkspace] = useMutation(ADD_WORKSPACE, {});
  const [loadingWorkspace, setLoadingWorkspace] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElAdmin, setAnchorElAdmin] = useState<null | HTMLElement>(null);
  const [openModalArchive, setOpenModalArchive] = useState<boolean>(false);
  const [openModalSetting, setOpenModalSetting] = useState<boolean>(false);
  const [WorkspaceSelected, setWorkspaceSelected] = useState<TWorkspace>();
  const [openModalAddWorkspace, setOpenModalAddWorkspace] =
    useState<boolean>(false);

  const [getDataWorkspaces] = useLazyQuery<TWorkspaces>(WORKSPACES_QUERY, {
    fetchPolicy: "network-only",
    onError(err) {
      if (err) {
        if (
          err.graphQLErrors.find(
            (errDetail) => errDetail.message == "TOKEN_INVALID"
          )
        ) {
          routerPush("/auth/login");
          document.cookie.split(";").forEach(function (c) {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(
                /=.*/,
                "=;expires=" + new Date().toUTCString() + ";path=/"
              );
          });
        }
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      workspaceSearch: "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      getWorkspaces(values.workspaceSearch);
    },
  });

  const getWorkspaces = useCallback(
    async (workspaceName: string) => {
      setLoadingWorkspace(true);
      try {
        const { data } = await getDataWorkspaces({
          variables: {
            payload: {
              name: workspaceName,
            },
          },
        });
        if (data && data.workspaces && data.workspaces.workspaces)
          setWorkspaces(data.workspaces.workspaces);
        setCurrentWorkspaceId(data?.workspaces?.current_workspace_id);
      } catch (error) {
        console.error("error", error);
      }
      setLoadingWorkspace(false);
    },
    [getDataWorkspaces]
  );

  const getAllWorkspace = () => {
    formik.resetForm();
    getWorkspaces("");
  };

  useEffect(() => {
    getAllWorkspace();
  }, [getWorkspaces]);

  useEffect(() => {
    const displayed = workspaces.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    setDisplayedWorkspaces(displayed);
  }, [page, rowsPerPage, workspaces]);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectWorkspace = async (workspaceId: string) => {
    routerPush({
      pathname: `/workspace/${workspaceId}`,
    });
    try {
      const data = setCurrentWorkspace({
        variables: {
          setCurrentWorkSpaceInput: {
            workspace_id: workspaceId,
          },
        },
      });
      console.info("data", data);
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleAddWorkspace = async (workspaceNameInput: string) => {
    try {
      const { data } = await addWorkspace({
        variables: {
          createWorkSpaceInput: {
            name: workspaceNameInput,
          },
        },
      });
      data && getAllWorkspace();
    } catch (err) {
      setNotification({
        open: true,
        severity: "error",
        message: "Add workspace error",
      });
    }
  };

  return (
    <DashboardLayout>
      {loadingWorkspace ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "80vh",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper>
            <TableContainer
              component={Paper}
              sx={{ borderRadius: "10px 10px 0 0" }}
            >
              <Table
                sx={{ minWidth: 650 }}
                size="medium"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell
                      sx={{
                        pt: "59px",
                        borderColor: "borderColor.tableCell",
                        borderWidth: "2px",
                        color: "#777",
                        lineHeight: "18px",
                      }}
                    >
                      {t("workspace")}
                    </StyledTableCell>
                    <StyledTableCell
                      align="right"
                      sx={{
                        pt: "59px",
                        borderColor: "borderColor.tableCell",
                        borderWidth: "2px",
                        color: "#fff",
                        textAlign: "left",
                        width: "25%",
                        lineHeight: "20px",
                      }}
                    >
                      <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{
                          border: "1px solid",
                          borderColor: "borderColor.button",
                          borderRadius: "5px",
                          backgroundColor: "background.boxModal",
                          alignItems: "right",
                        }}
                      >
                        <InputBase
                          id="workspaceSearch"
                          name="workspaceSearch"
                          size="small"
                          autoComplete="off"
                          sx={{
                            pl: 1,
                            pr: 1,
                            width: "100%",
                            "& .MuiInputBase-input": {
                              p: "5px",
                              backgroundColor: "background.boxModal !important",
                            },
                          }}
                          placeholder="Search"
                          value={formik.values.workspaceSearch}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </Box>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedWorkspaces.map((row) => (
                    <TableRow
                      key={row.workspace_id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        cursor: "pointer",
                        borderLeft:
                          row.workspace_id === currentWorkspaceId
                            ? "3px solid #00c6ab"
                            : "inherit",
                      }}
                      onClick={() => handleSelectWorkspace(row.workspace_id)}
                    >
                      <TableCell
                        colSpan={2}
                        component="th"
                        scope="row"
                        sx={{
                          borderColor: "borderColor.tableCell",
                          color:
                            row.workspace_id === currentWorkspaceId
                              ? "#00c6ab"
                              : "inherit",
                          fontWeight:
                            row.workspace_id === currentWorkspaceId
                              ? "bold"
                              : "inherit",
                        }}
                      >
                        {row.workspace_name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25]}
              component="div"
              count={workspaces.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_event, newPage) => setPage(newPage)}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                "& 	.MuiTablePagination-toolbar": {
                  pb: "63px",
                },
              }}
            />
          </Paper>
          <Button
            onClick={() => setOpenModalAddWorkspace(true)}
            sx={{
              mt: "24px",
              mb: "34px",
              backgroundColor: "background.button",
              border: "1px solid",
              borderColor: "borderColor.button",
              borderRadius: "5px",
              color: "text.primary",
              textTransform: "none",
            }}
          >
            + {t("add_new_workspace")}
          </Button>
        </>
      )}
      <MenuMoreVert
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        textEdit={t("edit")}
        textDelete={t("archive")}
        setOpenModalSetting={setOpenModalSetting}
        setOpenModalArchive={setOpenModalArchive}
      />
      <MenuMoreVert
        anchorEl={anchorElAdmin}
        setAnchorEl={setAnchorElAdmin}
        textEdit={t("admin")}
        textDelete={t("archive")}
      />
      <ModalSetting
        open={openModalSetting}
        setOpen={setOpenModalSetting}
        title={t("workspace_settings")}
        labelTabFirst={t("general")}
        formLabelFirstTabFirst={t("workspace_name")}
        dataWorkspace={WorkspaceSelected}
      />
      <ModalSetting
        isAddWorkspace
        open={openModalAddWorkspace}
        setOpen={setOpenModalAddWorkspace}
        title={t("add_workspace")}
        formLabelFirstTabFirst={t("workspace_name")}
        // formLabelSecondTabFirst={t("description")}
        handleAddWorkspace={handleAddWorkspace}
      />
      <ModalArchive
        open={openModalArchive}
        setOpen={setOpenModalArchive}
        title={t("archive_workspace")}
        subtitle={t("subtitle_archive_workspace")}
        data={WorkspaceSelected}
        textButtonDelete={t("archive")}
      />
    </DashboardLayout>
  );
};

export default WorkSpaceContainer;
