import React, { useState } from "react";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormLabel,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Popover,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";

import ButtonConfirm from "../buttonConfirm";
import * as styles from "./style";

const drawerWidth: number = 240;
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    height: "90vh",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  sx: {
    "&& .css-i9gqri-MuiButtonBase-root-MuiMenuItem-root.Mui-selected": {
      backgroundColor: "#00c6ab",
    },
    "&& .css-1fyk6f1-MuiButtonBase-root-MuiMenuItem-root.Mui-selected": {
      backgroundColor: "#00c6ab",
    },
  },
};

type TFields = {
  fields_id: string;
  fields_name: string;
  types: string;
  index: boolean;
  unique: boolean;
};
const fields: TFields[] = [
  {
    fields_id: "id",
    fields_name: "ID ",
    types: "Text",
    index: true,
    unique: true,
  },
  {
    fields_id: "Title",
    fields_name: "Title",
    types: "Text",
    index: true,
    unique: false,
  },
  {
    fields_id: "fields1",
    fields_name: "Fields1",
    types: "Text Area",
    index: false,
    unique: false,
  },
  {
    fields_id: "fields2",
    fields_name: "Fields2",
    types: "Number",
    index: false,
    unique: false,
  },
  {
    fields_id: "fields3",
    fields_name: "fields3",
    types: "Checkbox",
    index: false,
    unique: false,
  },
];

interface Props {
  openDataSetting: boolean;
  setOpenDataSetting: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataStoreSetting: React.FC<Props> = ({
  openDataSetting,
  setOpenDataSetting,
}) => {
  const [tabWorkSpace, setTabWorkSpace] = useState("general");
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const openMoreIcon = Boolean(anchorEl);
  const idMoreIcon = openMoreIcon ? "simple-popover" : undefined;
  const [openAddWorkspacePlan, setOpenAddWorkspacePlan] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState("Text");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTypes(event.target.value);
  };

  const handleClickMoreIcon = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMoreIcon = () => {
    setAnchorEl(null);
  };
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTabWorkSpace(newValue);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TabContext value={tabWorkSpace}>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openDataSetting}
        onClose={() => setOpenDataSetting(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openDataSetting}>
          <styles.BoxModal sx={{ backgroundColor: "background.boxModal" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "90%",
                overflow: "auto",
              }}
            >
              <Typography
                sx={{ color: "text.primary", m: 0 }}
                variant="h5"
                component="div"
                gutterBottom
              >
                Datastore Setting
              </Typography>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChangeTab}
                  aria-label="lab API tabs example"
                  TabIndicatorProps={{
                    style: {
                      display: "none",
                    },
                  }}
                >
                  <Tab
                    sx={{
                      textTransform: "none",
                      "&.Mui-selected": {
                        backgroundColor: "organization.background.default",
                        color: "text.primary",
                        border: "none",
                      },
                    }}
                    label="General"
                    value="general"
                  />
                  <Tab
                    sx={{
                      textTransform: "none",
                      "&.Mui-selected": {
                        backgroundColor: "organization.background.default",
                        color: "text.primary",
                      },
                    }}
                    label="Fields"
                    value="fields"
                  />
                </TabList>
              </Box>
              <TabPanel sx={{ p: 0 }} value="general">
                <styles.ToolbarCustom>
                  <FormLabel
                    sx={{
                      color: "text.primary",
                      width: "180px",
                    }}
                  >
                    DataStore ID
                  </FormLabel>
                  <TextField
                    sx={{
                      backgroundColor: "organization.background.default",
                      borderRadius: "5px",
                      ml: 8,
                    }}
                    value="Ds 1"
                    fullWidth
                    size={"small"}
                  />
                </styles.ToolbarCustom>
                <styles.ToolbarCustom>
                  <FormLabel
                    sx={{
                      color: "text.primary",
                      width: "180px",
                    }}
                  >
                    DataStore Name
                  </FormLabel>
                  <TextField
                    sx={{
                      backgroundColor: "organization.background.default",
                      borderRadius: "5px",
                      ml: 8,
                    }}
                    value="DataStore 1"
                    fullWidth
                    size={"small"}
                  />
                </styles.ToolbarCustom>
                <styles.ToolbarCustom>
                  <ButtonConfirm
                    buttonType="save"
                    buttonClick={() => setOpenDataSetting(false)}
                  />
                  <ButtonConfirm
                    buttonType="cancel"
                    buttonClick={() => setOpenDataSetting(false)}
                  />
                </styles.ToolbarCustom>
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value="fields">
                <Paper sx={{ width: "65%", boxShadow: "none", border: "none" }}>
                  <TableContainer sx={{ boxShadow: "none" }} component={Paper}>
                    <Table
                      sx={{
                        backgroundColor: "background.boxModal",
                        minWidth: 650,
                        maxHeight: "400px",
                        boxShadow: "none",
                      }}
                      size="small"
                      aria-label="a dense table"
                    >
                      <TableHead>
                        <TableRow
                          sx={{
                            "&:last-child th, &:last-child td": {
                              borderBottom: 0,
                            },
                          }}
                        >
                          <TableCell></TableCell>
                          <TableCell sx={{ p: 0 }}>Fields ID</TableCell>
                          <TableCell sx={{ p: 0 }}>Fields Name</TableCell>
                          <TableCell sx={{ p: 0 }}>Type</TableCell>
                          <TableCell sx={{ p: 0 }}>Index</TableCell>
                          <TableCell sx={{ p: 0 }}>Unique</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fields.map((row, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                              cursor: "pointer",
                            }}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              sx={{
                                textAlign: "right",
                                width: "15px",
                                p: 0,
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <IconButton
                                aria-label="more"
                                id="long-button"
                                aria-haspopup="true"
                              >
                                <DragIndicatorIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell sx={{ p: 0 }} component="th" scope="row">
                              <TextField
                                id="outlined-size-small"
                                defaultValue={row.fields_id}
                                size="small"
                              />
                            </TableCell>
                            <TableCell sx={{ p: 0 }} component="th" scope="row">
                              <TextField
                                id="outlined-size-small"
                                defaultValue={row.fields_name}
                                size="small"
                              />
                            </TableCell>
                            <TableCell sx={{ p: 0 }} component="th" scope="row">
                              <TextField
                                id="outlined-select-currency"
                                select
                                value={selectedTypes}
                                onChange={handleChange}
                                size="small"
                              >
                                {fields.map((option, index) => (
                                  <MenuItem key="indexOf" value={option.types}>
                                    {option.types}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </TableCell>
                            <TableCell sx={{ p: 0 }} padding="checkbox">
                              <Checkbox {...label} defaultChecked />
                            </TableCell>
                            <TableCell sx={{ p: 0 }} padding="checkbox">
                              <Checkbox {...label} disabled checked />
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              sx={{
                                textAlign: "right",
                                width: "15px",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <IconButton
                                aria-label="more"
                                id="long-button"
                                aria-haspopup="true"
                                aria-describedby={idMoreIcon}
                                onClick={handleClickMoreIcon}
                              >
                                <MoreVertIcon />
                              </IconButton>
                              <Popover
                                id={idMoreIcon}
                                open={openMoreIcon}
                                anchorEl={anchorEl}
                                onClose={handleCloseMoreIcon}
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "right",
                                }}
                                transformOrigin={{
                                  vertical: "top",
                                  horizontal: "center",
                                }}
                              >
                                <List sx={{ minWidth: "144px" }}>
                                  <ListItem disablePadding>
                                    <ListItemButton
                                      onClick={() =>
                                        setOpenAddWorkspacePlan(true)
                                      }
                                    >
                                      <ListItemText
                                        sx={{ color: "red" }}
                                        primary="Delete"
                                      />
                                    </ListItemButton>
                                  </ListItem>
                                </List>
                              </Popover>
                            </TableCell>
                            <Dialog
                              open={openAddWorkspacePlan}
                              onClose={() => setOpenAddWorkspacePlan(false)}
                              aria-labelledby="responsive-dialog-title"
                              sx={{ p: 5 }}
                            >
                              <DialogTitle id="responsive-dialog-title">
                                Delete Fields
                              </DialogTitle>
                              <DialogContent>
                                <Typography>Are you sure?</Typography>
                              </DialogContent>
                              <DialogActions
                                sx={{ mb: 2, mr: 2, justifyContent: "center" }}
                              >
                                <ButtonConfirm
                                  buttonType="cancel"
                                  buttonClick={() =>
                                    setOpenAddWorkspacePlan(false)
                                  }
                                />
                                <ButtonConfirm
                                  buttonType="delete"
                                  buttonClick={() =>
                                    setOpenAddWorkspacePlan(false)
                                  }
                                />
                              </DialogActions>
                            </Dialog>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    sx={{ backgroundColor: "background.boxModal" }}
                    rowsPerPageOptions={[10, 15, 20, 25]}
                    component="div"
                    count={fields.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
                <Button
                  sx={{
                    backgroundColor: "organization.background.default",
                    border: "1px solid #ACACAE",
                    color: "text.primary",
                    textTransform: "none",
                  }}
                >
                  + Add new Fields
                </Button>
                <Box sx={{ pl: 3 }}>
                  <ButtonConfirm
                    buttonType="save"
                    buttonClick={() => setOpenDataSetting(false)}
                  />
                  <ButtonConfirm
                    buttonType="cancel"
                    buttonClick={() => setOpenDataSetting(false)}
                  />
                </Box>
              </TabPanel>
            </Box>
          </styles.BoxModal>
        </Fade>
      </Modal>
    </TabContext>
  );
};

export default DataStoreSetting;
