import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { useTranslation } from "next-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Box, CircularProgress, TableContainer } from "@mui/material";

import ModalArchive from "../../components/modal/archiveModal";
import DeleteConfirm from "../../components/modal/deleteConfirm";
import ModalSetting from "../../components/modal/modalSetting";
import ResizeTable from "../../components/resizeTable";
import DashboardDetail from "../../container/DashboardDetail";
import {
  DATASTORE_FIELDS_QUERY,
  DATASTORE_GET_DATASTOREITEMS,
  DATASTORE_GET_FIELD,
  DATASTORE_QUERY,
} from "../../graphql/datastore";
import {
  APPLICATION_CREATE_PROJECT,
  APPLICATION_DELETE_PROJECT,
  APPLICATION_UPADATE_PROJECT,
  GET_APPLICATION_AND_DATA_STORE,
  GET_TEMPLATES,
} from "../../graphql/workspace";
import { datastoreGetDatastoreItemsState } from "../../recoil/atom/datastore";
import {
  DataStore,
  DataStoreGetField,
} from "../../recoil/atom/datastore/types";
import {
  applicationAndDatastoreState,
  dataColumnState,
  datastorePanelState,
  datastoresState,
  notificationState,
  openModalDatastoreSettingState,
  projectSelectedState,
  templateIdSelectedState,
  templatesState,
} from "../../recoil/atom/workspace";
import {
  TDatastoreGetDatastoreItems,
  TDatastoreGetFields,
  TTemplates,
  TWorkspaceDetail,
} from "../../recoil/atom/workspace/types";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import ItemDatastorePanel from "./ItemDatastorePanel";
import WorkSpaceMenu from "./MenuLeft";
import PanelRight from "./PanelRight";

const WorkSpaceDetailContainer: React.FC<{}> = () => {
  const { t } = useTranslation("workspace");
  const router = useRouter();

  const [openModalDatastoreSetting, setOpenModalDatastoreSetting] =
    useRecoilState(openModalDatastoreSettingState);
  const [applicationAndDatastore, setApplicationAndDatastore] = useRecoilState(
    applicationAndDatastoreState
  );
  const [datastorePanel, setDatastorePanel] =
    useRecoilState(datastorePanelState);

  const setDataTable = useSetRecoilState(datastoreGetDatastoreItemsState);
  const setNotification = useSetRecoilState(notificationState);
  const setDatastores = useSetRecoilState(datastoresState);
  const setTemplates = useSetRecoilState(templatesState);
  const setDataColumn = useSetRecoilState(dataColumnState);

  const projectSelected = useRecoilValue(projectSelectedState);
  const templateIdSelected = useRecoilValue(templateIdSelectedState);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [openModalAddProject, setModalAddProject] = useState<boolean>(false);
  const [openModalAddDatastore, setModalAddDatastore] = useState(false);
  const [openModalArchive, setOpenModalArchive] = useState<boolean>(false);
  const [loadingDataTable, setLoadingDataTable] = useState<boolean>(false);
  const [openProjectModalSetting, setOpenProjectModalSetting] =
    useState<boolean>(false);
  const [openProjectModalArchive, setOpenProjectModalArchive] =
    useState<boolean>(false);

  const {
    data: dataTemplate,
    loading: loadingTemplate,
    error: errorTemplate,
  } = useQuery<TTemplates>(GET_TEMPLATES);

  const {
    data: dataApplicationAndDatastore,
    loading: loadingApplicationAndDatastore,
    error: errorApplicationAndDatastore,
    refetch: refetchApplicationAndDatastore,
  } = useQuery<TWorkspaceDetail>(GET_APPLICATION_AND_DATA_STORE, {
    variables: {
      workspaceId: router.query.id || "",
    },
    notifyOnNetworkStatusChange: true,
  });

  const [applicationCreateProject] = useMutation(APPLICATION_CREATE_PROJECT);
  const [applicationUpdateProject] = useMutation(APPLICATION_UPADATE_PROJECT);
  const [applicationDeleteProject] = useMutation(APPLICATION_DELETE_PROJECT);
  const [datastoreGetDatastoreItems] = useMutation<TDatastoreGetDatastoreItems>(
    DATASTORE_GET_DATASTOREITEMS
  );

  const [getFieldDataStore] =
    useLazyQuery<DataStoreGetField>(DATASTORE_GET_FIELD);
  const [getDatastore, { loading: loadingDatastore }] = useLazyQuery<DataStore>(
    DATASTORE_QUERY,
    {
      onError(error) {
        console.error("error", error);
      },
    }
  );
  const [GetDatastoreFields] = useLazyQuery<TDatastoreGetFields>(
    DATASTORE_FIELDS_QUERY
  );

  const dataGetDatastore = useCallback(async () => {
    try {
      const dataRes = await getDatastore({
        variables: {
          applicationId: router.query.application_id,
        },
      });

      if (dataRes.data) {
        setDatastores(dataRes.data.getApplicationDatastores);
      }
    } catch (error) {
      console.error("error", error);
    }
  }, [getDatastore, router.query.application_id, setDatastores]);

  const dataGetDatastoreTable = useCallback(async () => {
    setLoadingDataTable(true);
    try {
      const { data } = await GetDatastoreFields({
        variables: {
          projectId: router.query.application_id,
          datastoreId: router.query.datastore_id,
        },
      });

      if (data) {
        const { data: dataTableRes } = await datastoreGetDatastoreItems({
          variables: {
            getItemsParameters: {
              page: 1,
              per_page: 0,
            },
            datastoreId: router.query.datastore_id,
            projectId: router.query.application_id,
          },
        });
        setDataColumn(data.datastoreGetFields.fields);

        if (dataTableRes) {
          setDataTable(dataTableRes);
        }
      }
    } catch (error) {
      console.error("error", error);
    }
    setLoadingDataTable(false);
  }, [
    GetDatastoreFields,
    datastoreGetDatastoreItems,
    router.query.application_id,
    router.query.datastore_id,
    setDataColumn,
    setDataTable,
  ]);

  useEffect(() => {
    if (dataTemplate && !loadingTemplate && !errorTemplate) {
      setTemplates(dataTemplate);
    }
  }, [dataTemplate, loadingTemplate, errorTemplate, setTemplates]);

  const handleAddProject = async (
    enProjectName: string,
    jaProjectName: string
  ) => {
    try {
      const { data } = await applicationCreateProject({
        variables: {
          createProjectParams: {
            name: {
              en: enProjectName,
              ja: jaProjectName,
            },
            tp_id: templateIdSelected,
          },
        },
      });

      if (data) {
        setNotification({
          open: true,
          severity: "success",
          message: "add project success",
        });

        refetchApplicationAndDatastore();
      }
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: "add project err",
      });
    }
  };

  const handleUpdateProject = async (
    enProjectName: string,
    jaProjectName: string,
    projectDisplayId: string | null,
    themeId: string | null
  ) => {
    try {
      const { data } = await applicationUpdateProject({
        variables: {
          payload: {
            project_id: projectSelected?.application_id,
            project_name: {
              en: enProjectName,
              ja: jaProjectName,
            },
            project_displayid: projectDisplayId || null,
            theme: themeId || null,
          },
        },
      });
      if (data) {
        setNotification({
          open: true,
          severity: "success",
          message: "Update project success",
        });
        refetchApplicationAndDatastore();
      }
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: "Update project err",
      });
    }
  };

  const handleDeleteProject = async () => {
    try {
      const { data } = await applicationDeleteProject({
        variables: {
          payload: {
            project_id: projectSelected?.application_id,
          },
        },
      });
      if (data) {
        setNotification({
          open: true,
          severity: "success",
          message: "Delete project success",
        });

        refetchApplicationAndDatastore();
      }
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: "Delete project err",
      });
    }
  };

  useEffect(() => {
    if (applicationAndDatastore?.getApplicationAndDataStore) {
      const applicationId =
        router.query.application_id ||
        applicationAndDatastore.getApplicationAndDataStore[0].application_id;

      router.replace(
        `/workspace/${router.query.id}?application_id=${applicationId}`,
        `/workspace/${router.query.id}?application_id=${applicationId}`,
        {
          shallow: true,
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationAndDatastore]);

  useEffect(() => {
    setDatastorePanel({ open: false, action: "HIDE" });
  }, [
    router.query.id,
    router.query.datastore_id,
    router.query.application_id,
    setDatastorePanel,
  ]);

  useEffect(() => {
    dataGetDatastore();
  }, [dataGetDatastore, router.query.application_id]);

  useEffect(() => {
    dataGetDatastoreTable();
  }, [
    dataGetDatastoreTable,
    router.query.application_id,
    router.query.datastore_id,
  ]);

  useEffect(() => {
    if (
      !loadingApplicationAndDatastore &&
      dataApplicationAndDatastore &&
      !errorApplicationAndDatastore
    ) {
      setApplicationAndDatastore(dataApplicationAndDatastore);
    }
  }, [
    loadingApplicationAndDatastore,
    dataApplicationAndDatastore,
    errorApplicationAndDatastore,
    setApplicationAndDatastore,
  ]);

  return (
    <>
      <DashboardDetail>
        <Box
          sx={{
            width: "100%",
            height: "calc(100vh - 62px)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <WorkSpaceMenu
            setModalAddProject={setModalAddProject}
            setOpenModalArchive={setOpenModalArchive}
            setOpenProjectModalSetting={setOpenProjectModalSetting}
            setOpenProjectModalArchive={setOpenProjectModalArchive}
            setModalAddDatastore={setModalAddDatastore}
          />
          <Box
            sx={{
              maxWidth: "calc(100vw - 310px)",
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            {loadingDataTable ||
            loadingApplicationAndDatastore ||
            loadingDatastore ? (
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
                {router.query.datastore_id && (
                  <>
                    <EnhancedTableToolbar />
                    <Box
                      component="main"
                      sx={{
                        display: "flex",
                        position: "relative",
                        height: "100vh",
                      }}
                    >
                      <TableContainer
                        sx={{
                          ".ag-header-row.ag-header-row-column": {
                            backgroundColor: "background.paper",
                          },
                          ".ag-body-viewport .ag-row": {
                            borderColor: "rgba(200, 200, 200, 0.1)",
                            backgroundColor: "background.paper",
                            "&.ag-row-selected": {
                              backgroundColor: "background.highlight",
                            },
                            ".ag-cell.ag-cell-focus": {
                              borderColor: "transparent !important",
                            },
                          },
                        }}
                      >
                        <ResizeTable
                          dataGetDatastoreTable={dataGetDatastoreTable}
                        />
                      </TableContainer>
                      <Box
                        ref={wrapperRef}
                        sx={{
                          position: "absolute",
                          right: "0",
                          display: "flex",
                          backgroundColor: "background.boxModal",
                          height: "100vh",
                        }}
                      >
                        {datastorePanel.open && (
                          <ItemDatastorePanel
                            dataGetDatastoreTable={dataGetDatastoreTable}
                          />
                        )}
                        <PanelRight />
                      </Box>
                    </Box>
                  </>
                )}
              </>
            )}
          </Box>
        </Box>
        <ModalSetting
          isAddProject
          open={openModalAddProject}
          setOpen={setModalAddProject}
          title={t("add_project")}
          formLabelFirstTabFirst={t("project_name")}
          // formLabelFirstTabFirst={t("project_id")}
          // formLabelSecondTabFirst={t("project_name")}
          handleAddProject={handleAddProject}
        />
        <ModalSetting
          isAddDatastore
          open={openModalAddDatastore}
          setOpen={setModalAddDatastore}
          title={t("add_datastore")}
          formLabelFirstTabFirst={t("datastore_name")}
          // formLabelFirstTabFirst={t("datastore_id")}
          // formLabelSecondTabFirst={t("datastore_name")}
        />

        {/* hide field tab */}
        <ModalSetting
          isDatastoreSetting
          open={openModalDatastoreSetting}
          setOpen={setOpenModalDatastoreSetting}
          title={t("datastore_settings")}
          labelTabFirst={t("general")}
          formLabelFirstTabFirst={t("datastore_name")}
          // labelTabSecond={t("fields")}
          // formLabelFirstTabFirst={t("datastore_id")}
          // formLabelSecondTabFirst={t("datastore_name")}
        />
        <ModalArchive
          isDeleteDatastore
          open={openModalArchive}
          setOpen={setOpenModalArchive}
          title={t("delete_this_datastore")}
          subtitle={
            <span>
              {t("confirm_delete")} <br />
              {t("subtitle")}
            </span>
          }
          textButtonDelete={t("delete")}
        />
        <ModalSetting
          isProjectSetting
          open={openProjectModalSetting}
          setOpen={setOpenProjectModalSetting}
          title={t("project_settings")}
          labelTabFirst={t("general")}
          // formLabelFirstTabFirst={t("project_id")}
          // formLabelSecondTabFirst={t("project_name")}
          formLabelFirstTabFirst={t("project_name")}
          handleUpdateProject={handleUpdateProject}
        />
        <ModalArchive
          isDeleteProject
          open={openProjectModalArchive}
          setOpen={setOpenProjectModalArchive}
          title={t("delete_this_project")}
          subtitle={
            <span>
              {t("confirm_delete_project")} <br />
              {t("subtitle_project")}
            </span>
          }
          textButtonDelete={t("delete")}
          handleDeleteProject={handleDeleteProject}
        />
      </DashboardDetail>
    </>
  );
};

export default WorkSpaceDetailContainer;
