/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";

import MenuMoreVert from "../../components/modal/menuMoreVert";
import {
  applicationAndDatastoreState,
  datastoreCurrentSelectedState,
  datastoresState,
  openModalDatastoreSettingState,
  projectSelectedState,
} from "../../recoil/atom/workspace";
import { TWorkspaceDetailDatastoresItem } from "../../recoil/atom/workspace/types";
import * as styles from "./style";

const drawerWidth: number = 240;
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    height: "100%",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    "&::-webkit-scrollbar": {
      width: "0px",
      height: "0px",
    },
  },
}));

interface WorkSpaceMenuProps {
  setOpenModalSetting?: React.Dispatch<React.SetStateAction<boolean>>;
  setModalAddProject?: React.Dispatch<React.SetStateAction<boolean>>;
  setModalAddDatastore?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenModalArchive?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenProjectModalSetting?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenProjectModalArchive?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      left: 5,
    },
    sx: {
      marginLeft: 4,
      "&& .css-i9gqri-MuiButtonBase-root-MuiMenuItem-root.Mui-selected": {
        backgroundColor: "#00c6ab",
      },
      "&& .css-1fyk6f1-MuiButtonBase-root-MuiMenuItem-root.Mui-selected": {
        backgroundColor: "#00c6ab",
      },
    },
  },
};

const WorkSpaceMenu: React.FC<WorkSpaceMenuProps> = ({
  setOpenModalSetting,
  setModalAddProject,
  setOpenModalArchive,
  setOpenProjectModalSetting,
  setOpenProjectModalArchive,
  setModalAddDatastore,
}) => {
  const { t } = useTranslation("workspace");
  const router = useRouter();

  const setDatastoreCurrentSelected = useSetRecoilState(
    datastoreCurrentSelectedState
  );
  const setOpenModalDatastoreSetting = useSetRecoilState(
    openModalDatastoreSettingState
  );
  const setProjectSelected = useSetRecoilState(projectSelectedState);
  const applicationAndDatastore = useRecoilValue(applicationAndDatastoreState);
  const datastores = useRecoilValue(datastoresState);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElProject, setAnchorElProject] = useState<null | HTMLElement>(
    null
  );

  const projectIdSelected = useMemo(() => {
    return router.query.application_id;
  }, [router.query.application_id]);

  const checkOpenDefault = useCallback(
    (listItem: TWorkspaceDetailDatastoresItem[], valueFind = "") => {
      if (listItem && listItem.length > 0 && valueFind) {
        const findX = listItem.findIndex(
          (item) => item.datastore_id === valueFind
        );
        if (findX !== -1) {
          return true;
        }
      }
      return false;
    },
    []
  );

  const handleClickAddProject = () => {
    setModalAddProject && setModalAddProject(true);
  };

  useEffect(() => {
    const projectFind =
      applicationAndDatastore?.getApplicationAndDataStore.find(
        (item) => item.application_id === projectIdSelected
      );
    setProjectSelected(projectFind);
  }, [
    applicationAndDatastore?.getApplicationAndDataStore,
    projectIdSelected,
    setProjectSelected,
  ]);

  return (
    <Drawer variant="permanent" open={true}>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          backgroundColor: "background.paper",
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            sx={{
              pl: "12px",
              pr: "6px",
              color: "text.listSubheader",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "12px",
                color: "#ACACAE",
              }}
            >
              <span>{t("projects")}</span>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <AddIcon
                  onClick={handleClickAddProject}
                  sx={{ width: "22px", height: "22px" }}
                />
              </Box>
            </Box>
          </ListSubheader>
        }
      >
        {projectIdSelected && (
          <FormControl
            sx={{
              m: 0,
              width: "170px",
              display: "inline",
            }}
          >
            <Select
              defaultValue={
                applicationAndDatastore?.getApplicationAndDataStore[0]
                  .application_id
              }
              value={projectIdSelected}
              MenuProps={MenuProps}
              inputProps={{ "aria-label": "Without label" }}
              onChange={(e) => {
                router.replace(
                  `/workspace/${router.query.id}?application_id=${e.target.value}`,
                  `/workspace/${router.query.id}?application_id=${e.target.value}`,
                  {
                    shallow: true,
                  }
                );
              }}
              sx={{
                fontSize: "15px",
                fontWeight: "bold",
                color: "#00c6ab",
                backgroundColor: "unset",
                paddingLeft: "8px",
                height: "40px",
                border: "unset",
                borderColor: "unset",
                ".MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                width: "202px",
              }}
            >
              {applicationAndDatastore?.getApplicationAndDataStore.map(
                (itemDataStore) => (
                  <MenuItem
                    key={itemDataStore.application_id}
                    value={itemDataStore.application_id}
                  >
                    {itemDataStore.name}
                  </MenuItem>
                )
              )}
            </Select>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-haspopup="true"
              onClick={(event) => setAnchorElProject(event.currentTarget)}
            >
              <MoreVertIcon />
            </IconButton>
          </FormControl>
        )}
      </List>

      {applicationAndDatastore?.getApplicationAndDataStore.map(
        (itemDataStore, index) => {
          if (itemDataStore.application_id === router.query.application_id) {
            return (
              <Box
                key={index}
                sx={{
                  maxHeight: "calc(100vh - 170px)",
                  overflow: "auto",
                  "&::-webkit-scrollbar": {
                    width: "0px",
                    height: "0px",
                  },
                }}
              >
                <styles.AccordionCustom
                  defaultExpanded={true}
                  disableGutters={true}
                  square={true}
                  sx={{
                    m: "0!important",
                    pl: 0,
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{
                      pl: "12px",
                      pr: "6px",
                      marginTop: "10px",
                      color: "text.listSubheader",
                      "& .MuiAccordionSummary-content": {
                        justifyContent: "space-between",
                      },
                    }}
                  >
                    <Typography
                      noWrap
                      sx={{
                        maxWidth: "170px",
                        fontSize: "12px",
                        color: "#ACACAE",
                      }}
                    >
                      {t("datastores")}
                    </Typography>
                    {/* <AddIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalAddDatastore && setModalAddDatastore(true);
                      }}
                      sx={{
                        width: "22px",
                        height: "22px",
                        ".MuiAccordionSummary-root": {
                          pointerEvents: "none",
                        },
                      }}
                    /> */}
                  </AccordionSummary>
                  <AccordionDetails sx={{ pl: 0, pr: 0, pt: 0 }}>
                    {datastores?.map((datastore) => (
                      <ListItem
                        key={datastore.datastore_id}
                        onClick={() => {
                          setDatastoreCurrentSelected({
                            ...datastore,
                          });
                          router.replace(
                            `/workspace/${router.query.id}?datastore_id=${datastore.datastore_id}&application_id=${itemDataStore.application_id}`,
                            `/workspace/${router.query.id}?datastore_id=${datastore.datastore_id}&application_id=${itemDataStore.application_id}`,
                            {
                              shallow: true,
                            }
                          );
                        }}
                        sx={{ p: 0 }}
                        button
                      >
                        <ListItemText
                          sx={{ m: 0 }}
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                }}
                              >
                                <Divider
                                  orientation={"vertical"}
                                  sx={{
                                    width: () => {
                                      return router.query.datastore_id &&
                                        router.query.datastore_id ===
                                          datastore.datastore_id
                                        ? "2px"
                                        : "0px";
                                    },
                                    border: "unset",
                                    backgroundColor: "#00c6ab",
                                    height: "24px",
                                    mr: () => {
                                      return router.query.datastore_id &&
                                        router.query.datastore_id ===
                                          datastore.datastore_id
                                        ? "20px"
                                        : "22px";
                                    },
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontSize: "13px",
                                    lineHeight: "24px",
                                    maxWidth: "170px",
                                    color: (theme) => {
                                      return router.query.datastore_id &&
                                        router.query.datastore_id ===
                                          datastore.datastore_id
                                        ? "#00c6ab"
                                        : theme.palette.text.primary;
                                    },
                                  }}
                                  noWrap
                                >
                                  {datastore.name}
                                </Typography>
                              </Box>
                              {/* <Box
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <IconButton
                                    aria-label="more"
                                    id="long-button"
                                    aria-haspopup="true"
                                    onClick={(event) => {
                                      setDatastoreSelected &&
                                        setDatastoreSelected(datastore);
                                      setAnchorEl(event.currentTarget);
                                    }}
                                  >
                                    <MoreVertIcon />
                                  </IconButton>
                                </Box> */}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                    <MenuMoreVert
                      anchorEl={anchorEl}
                      setAnchorEl={setAnchorEl}
                      textEdit={t("edit")}
                      textDelete={t("delete")}
                      setOpenModalSetting={setOpenModalSetting}
                      setOpenModalArchive={setOpenModalArchive}
                    />
                    <MenuMoreVert
                      anchorEl={anchorElProject}
                      setAnchorEl={setAnchorElProject}
                      textEdit={t("edit")}
                      // textDelete={t("delete")}
                      setOpenModalSetting={setOpenProjectModalSetting}
                      setOpenModalArchive={setOpenProjectModalArchive}
                    />
                  </AccordionDetails>
                </styles.AccordionCustom>
              </Box>
            );
          }
          return null;
        }
      )}
    </Drawer>
  );
};

export default WorkSpaceMenu;
