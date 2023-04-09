import React, { useMemo, useState } from "react";

import { useFormik } from "formik";
import { useTranslation } from "next-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import * as yup from "yup";

import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Modal,
  Tab,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  datastoreSelectedState,
  projectSelectedState,
  templateIdSelectedState,
  templatesState,
} from "../../../recoil/atom/workspace";
import { TWorkspace } from "../../../recoil/atom/workspace/types";
import ButtonConfirm from "../../buttonConfirm";
import TabFieldsModal from "../tabFieldsModal";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  labelTabFirst?: string;
  labelTabSecond?: string;
  formLabelFirstTabFirst?: string;
  formLabelSecondTabFirst?: string;
  isAddDatastore?: boolean;
  isDatastoreSetting?: boolean;
  isAddProject?: boolean;
  isProjectSetting?: boolean;
  isAddWorkspace?: boolean;
  dataWorkspace?: TWorkspace;
  handleAddWorkspace?: (workspaceNameInput: string) => Promise<void>;
  handleAddProject?: (
    enProjectName: string,
    jaProjectName: string
  ) => Promise<void>;
  handleUpdateProject?: (
    enProjectName: string,
    jaProjectName: string,
    projectDisplayId: string | null,
    themeId: string | null
  ) => Promise<void>;
}

const ModalSetting: React.FC<Props> = ({
  open,
  setOpen,
  title,
  labelTabFirst,
  labelTabSecond,
  formLabelFirstTabFirst,
  formLabelSecondTabFirst,
  isAddDatastore,
  isDatastoreSetting,
  isAddProject,
  isProjectSetting,
  isAddWorkspace,
  dataWorkspace,
  handleAddWorkspace,
  handleAddProject,
  handleUpdateProject,
}) => {
  const { t } = useTranslation("common");

  const [templateIdSelected, setTemplateIdSelected] = useRecoilState(
    templateIdSelectedState
  );
  const datastoreSelected = useRecoilValue(datastoreSelectedState);
  const projectSelected = useRecoilValue(projectSelectedState);
  const templates = useRecoilValue(templatesState);

  const tabTemplateDefault = useMemo(() => {
    if (templates.getTemplates.categories.length > 0)
      return templates.getTemplates.categories[0].category;
    return "Examples";
  }, [templates]);

  const [tabTemplate, setTabTemplate] = useState(tabTemplateDefault);
  const [tabWorkSpace, setTabWorkSpace] = useState("1");

  const formik = useFormik({
    initialValues: {
      textField1: isDatastoreSetting
        ? datastoreSelected.name
        : dataWorkspace
        ? dataWorkspace.workspace_name
        : isProjectSetting && projectSelected
        ? projectSelected.name
        : "",
      textField2: isDatastoreSetting
        ? datastoreSelected.name
        : dataWorkspace
        ? dataWorkspace.workspace_name
        : isProjectSetting && projectSelected
        ? projectSelected.name
        : "",
    },
    enableReinitialize: true,
    validationSchema:
      isAddProject || isProjectSetting
        ? yup.object().shape({
            textField1: yup.string().required(t("project_name_required")),
          })
        : isAddWorkspace
        ? yup.object().shape({
            textField1: yup.string().required(t("workspace_name_required")),
          })
        : "",
    onSubmit: (values) => {
      handleAddWorkspace && handleAddWorkspace(values.textField1);
      handleAddProject &&
        handleAddProject(values.textField1, values.textField1);
      handleUpdateProject &&
        handleUpdateProject(values.textField1, values.textField1, null, null);
      setOpen(false);
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: string) => {
    setTabWorkSpace(newValue);
  };

  const handleChangeTabTemplate = (
    _event: React.SyntheticEvent,
    newValue: string
  ) => {
    setTabTemplate(newValue);
  };

  return (
    <TabContext value={tabWorkSpace}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            minHeight: "80%",
            backgroundColor: "background.modal",
            color: "text.primary",
            border: "1px solid #555558",
            boxShadow: 24,
            p: 4,
            borderRadius: "5px",
          }}
        >
          <Typography
            sx={{ color: "text.primary", m: 0 }}
            variant="h5"
            component="div"
            gutterBottom
          >
            {title}
          </Typography>
          {labelTabFirst && (
            <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
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
                      backgroundColor: "background.tabSelected",
                      color: "text.primary",
                      border: "none",
                    },
                  }}
                  label={labelTabFirst}
                  value="1"
                />
                {labelTabSecond && (
                  <Tab
                    sx={{
                      textTransform: "none",
                      "&.Mui-selected": {
                        backgroundColor: "background.tabSelected",
                        color: "text.primary",
                      },
                    }}
                    label={labelTabSecond}
                    value="2"
                  />
                )}
              </TabList>
            </Box>
          )}
          <TabPanel sx={{ p: 0 }} value="1">
            <Box component="form" onSubmit={formik.handleSubmit}>
              <Toolbar sx={{ mt: "14px" }}>
                <FormLabel
                  sx={{
                    color: "text.primary",
                    width: "180px",
                  }}
                >
                  {formLabelFirstTabFirst}
                </FormLabel>
                <TextField
                  name="textField1"
                  value={formik.values.textField1}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.textField1 &&
                    Boolean(formik.errors.textField1)
                  }
                  helperText={
                    formik.touched.textField1 && formik.errors.textField1
                  }
                  fullWidth
                  size={"small"}
                  sx={{
                    borderRadius: "10px",
                    ml: 8,
                    width: "150ch",
                    "& .MuiInputBase-root": {
                      backgroundColor: "organization.background.default",
                    },
                  }}
                />
              </Toolbar>
              {formLabelSecondTabFirst && (
                <>
                  <Toolbar sx={{ mt: "14px" }}>
                    <FormLabel
                      sx={{
                        color: "text.primary",
                        width: "180px",
                      }}
                    >
                      {formLabelSecondTabFirst}
                    </FormLabel>
                    <TextField
                      name="textField2"
                      value={formik.values.textField2}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.textField2 &&
                        Boolean(formik.errors.textField2)
                      }
                      helperText={
                        formik.touched.textField2 && formik.errors.textField2
                      }
                      fullWidth
                      size={"small"}
                      sx={{
                        backgroundColor: "organization.background.default",
                        borderRadius: "10px",
                        ml: 8,
                        width: "150ch",
                      }}
                    />
                  </Toolbar>
                </>
              )}
              {isAddProject && (
                <>
                  <Box sx={{ p: 3 }}>
                    <Typography
                      sx={{ color: "text.primary", m: 0 }}
                      variant="h6"
                      component="div"
                      gutterBottom
                    >
                      {t("template")}
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!templateIdSelected}
                            onChange={() => setTemplateIdSelected("")}
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<RadioButtonCheckedIcon />}
                            sx={{
                              "&.MuiCheckbox-colorPrimary.Mui-checked": {
                                color: "#0ACCB2",
                              },
                            }}
                          />
                        }
                        label="Blank"
                      />
                    </FormGroup>
                  </Box>
                  <TabContext value={tabTemplate}>
                    <Box
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        pl: 1,
                      }}
                    >
                      <TabList
                        onChange={handleChangeTabTemplate}
                        aria-label="lab API tabs example"
                        TabIndicatorProps={{
                          style: {
                            display: "none",
                          },
                        }}
                      >
                        {templates?.getTemplates.categories.map(
                          (item, index) => (
                            <Tab
                              key={index}
                              label={item.category}
                              value={item.category}
                              sx={{
                                textTransform: "none",
                                "&.Mui-selected": {
                                  backgroundColor: "background.tabSelected",
                                  color: "text.primary",
                                  border: "none",
                                },
                              }}
                            />
                          )
                        )}
                      </TabList>
                    </Box>
                    {templates?.getTemplates.categories.map((item, index) => (
                      <TabPanel key={index} value={item.category}>
                        {item.templates.map((itemTemplate) => (
                          <>
                            <Grid
                              container
                              spacing={2}
                              sx={{ alignItems: "center" }}
                            >
                              <Grid item xs={4}>
                                <FormGroup>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={
                                          templateIdSelected ===
                                          itemTemplate.tp_id
                                        }
                                        onChange={() =>
                                          setTemplateIdSelected(
                                            itemTemplate.tp_id
                                          )
                                        }
                                        icon={<RadioButtonUncheckedIcon />}
                                        checkedIcon={<RadioButtonCheckedIcon />}
                                        sx={{
                                          "&.MuiCheckbox-colorPrimary.Mui-checked":
                                            {
                                              color: "#0ACCB2",
                                            },
                                        }}
                                      />
                                    }
                                    label={
                                      <Typography>
                                        {itemTemplate.name}
                                      </Typography>
                                    }
                                  />
                                </FormGroup>
                              </Grid>
                              <Grid item xs={8}>
                                <Typography
                                  variant="body2"
                                  gutterBottom
                                  sx={{ m: 0 }}
                                >
                                  {itemTemplate.description}
                                </Typography>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                      </TabPanel>
                    ))}
                  </TabContext>
                </>
              )}
              <ButtonConfirm buttonType="save" type="submit" />
              <ButtonConfirm
                buttonType="cancel"
                buttonClick={() => handleClose()}
              />
            </Box>
          </TabPanel>
          <TabPanel sx={{ p: 0, height: "70%" }} value="2">
            {dataWorkspace ? (
              <Typography variant="h3">Workspace User Tab</Typography>
            ) : isDatastoreSetting ? (
              <TabFieldsModal setOpenModalSetting={setOpen} />
            ) : null}
          </TabPanel>
        </Box>
      </Modal>
    </TabContext>
  );
};

export default ModalSetting;
