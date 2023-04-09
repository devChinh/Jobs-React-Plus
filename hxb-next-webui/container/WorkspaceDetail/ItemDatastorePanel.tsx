import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import AttachmentIcon from "@mui/icons-material/Attachment";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import ButtonConfirm from "../../components/buttonConfirm";
import {
  CREATE_ITEM_FILE_ATTACHMENT,
  DATASTORE_CREATE_NEW_ITEM,
  DATASTORE_UPDATE_ITEM,
  DOWNLOAD_FILE_QUERY,
  GET_DATASTORE_ITEM_DETAILS,
} from "../../graphql/workspace";
import ColorModeContext from "../../modules/styles/ColorModeContext";
import {
  TActionPanel,
  TDatastoreStatus,
  TFieldDatastore,
  TFileTypeField,
} from "../../recoil/atom/datastore/types";
import {
  dataColumnState,
  datastorePanelState,
  deleteModalState,
  itemTableSelectedState,
  notificationState,
} from "../../recoil/atom/workspace";

dayjs.extend(utc);
dayjs.locale("ja");

const checkBase64 =
  /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;

const ItemDatastorePanel: React.FC<{
  dataGetDatastoreTable: () => Promise<void>;
}> = ({ dataGetDatastoreTable }) => {
  const router = useRouter();
  const { darkMode } = useContext(ColorModeContext);

  const [itemTableSelected, setItemTableSelected] = useRecoilState(
    itemTableSelectedState
  );
  const [datastorePanel, setDatastorePanel] =
    useRecoilState(datastorePanelState);

  const setDeleteModal = useSetRecoilState(deleteModalState);
  const setNotification = useSetRecoilState(notificationState);

  const dataColumn = useRecoilValue(dataColumnState);

  const [dataFiles, setDataFiles] = useState<TFileTypeField[]>();
  const [fields, setFields] = useState<{ [key: string]: TFieldDatastore }>({});
  const [statusList, setStatusList] = useState<TDatastoreStatus[]>([]);
  const [revNo, setRevNo] = useState<number>(1);
  const [fileNameUpload, setFileNameUpload] = useState<string>();
  const [fileIdUpload, setFileIdUpload] = useState<string[]>();

  const {
    data,
    loading,
    error,
    refetch: refetchDataItemDetail,
  } = useQuery(GET_DATASTORE_ITEM_DETAILS, {
    variables: {
      datastoreId: router.query.datastore_id || "",
      projectId: router.query.application_id || "",
      itemId: itemTableSelected?.i_id || "",
    },
  });

  const [downloadFileQuery] = useLazyQuery(DOWNLOAD_FILE_QUERY);

  const [datastoreUpdateItem] = useMutation(DATASTORE_UPDATE_ITEM);
  const [datastoreCreateNewItem] = useMutation(DATASTORE_CREATE_NEW_ITEM);
  const [createItemFileAttachment, { loading: loadingUploadFile }] =
    useMutation(CREATE_ITEM_FILE_ATTACHMENT);

  useEffect(() => {
    if (!loading && data && !error) {
      setDataFiles(
        data.getDatastoreItemDetails?.field_values.filter(
          (item: { dataType: string }) => item.dataType === "file"
        )
      );

      setFields(data.getDatastoreItemDetails?.fields);
      setStatusList(data.getDatastoreItemDetails.status_list);
      setRevNo(data.getDatastoreItemDetails.rev_no);
    }
  }, [loading, data, error]);

  const initialValues = useMemo(() => {
    const initial: { [key: string]: any } = {};
    Object.keys(dataColumn).map((key) => {
      initial[key] = itemTableSelected[key] || null;
    });

    return initial;
  }, [dataColumn, itemTableSelected]);

  const actionPanel: TActionPanel = useMemo(() => {
    return datastorePanel.action;
  }, [datastorePanel]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (actionPanel === "EDIT") {
        const payload: {
          [key: string]: any;
        } = {};

        Object.keys(fields).map((key) => {
          payload[key] = convertPayloadFieldEdit(key, values, fields[key]);
        });

        const payloadUpdate: {
          [key: string]: any;
        } = {};

        Object.keys(payload).map((key) => {
          if (payload[key]) {
            payloadUpdate[key] = payload[key];
          }
        });

        dataDatastoreUpdateItem({
          rev_no: revNo,
          item: payloadUpdate,
        });
      }
      if (actionPanel === "NEW") {
        const payloadCreate: {
          [key: string]: any;
        } = {};

        Object.keys(values).map((key) => {
          if (values[key]) {
            if (dayjs(values[key], "YYYY-MM-DDTHH:mm:ssz", true).isValid()) {
              payloadCreate[key] = dayjs(values[key])
                .format("YYYY-MM-DDTHH:mm:ssz")
                .toUpperCase();
            } else {
              payloadCreate[key] = values[key];
            }
          }
        });

        dataDatastoreCreateNewItem(payloadCreate);
      }
    },
  });

  const downloadBase64File = (contentBase64: string, fileName: string) => {
    let fileType = "";
    let linkSource = "";
    const lastDot = fileName.lastIndexOf(".");

    if (lastDot < 0) {
      fileType = fileName.substring(lastDot + 1);
    }

    if (contentBase64.indexOf(`data:application/${fileType};base64,`) !== -1) {
      linkSource = `${contentBase64}`;
    } else {
      linkSource = `data:application/${fileType};base64,${contentBase64}`;
    }

    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);

    downloadLink.href = linkSource;
    downloadLink.target = "_self";
    downloadLink.download = fileName;
    downloadLink.click();
  };

  const downLoadFile = useCallback(
    async (file_id: string) => {
      try {
        const { data } = await downloadFileQuery({
          variables: { id: file_id },
        });

        if (checkBase64.test(data.getDownloadFile.data)) {
          downloadBase64File(
            data.getDownloadFile.data,
            data.getDownloadFile.filename
          );
        } else {
          setNotification({
            open: true,
            severity: "error",
            message: "file isvalid base64 format",
          });
        }
      } catch (error) {
        setNotification({
          open: true,
          severity: "error",
          message: "download file error",
        });
      }
    },
    [downloadFileQuery, setNotification]
  );

  const uploadFile = useCallback(
    async (file: File, key: string, baseURL: string) => {
      try {
        const { data } = await createItemFileAttachment({
          variables: {
            payload: {
              filename: file.name,
              contentTypeFile: file.type,
              filepath: `${router.query.datastore_id}/${itemTableSelected.i_id}/${dataColumn[key].field_id}/${file.name}`,
              content: baseURL,
              d_id: router.query.datastore_id,
              p_id: router.query.application_id,
              field_id: dataColumn[key].field_id,
              item_id: itemTableSelected.i_id,
              display_order: 0,
            },
          },
        });

        if (data) {
          setFileNameUpload(data.createItemFileAttachment.filename);
          setFileIdUpload([data.createItemFileAttachment.file_id]);
        }
      } catch (error) {
        setNotification({
          open: true,
          severity: "error",
          message: "upload file error",
        });
      }
    },
    [
      createItemFileAttachment,
      dataColumn,
      itemTableSelected.i_id,
      router.query.application_id,
      router.query.datastore_id,
      setNotification,
    ]
  );

  const getBase64 = useCallback(
    (file: File, key: string) => {
      let reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        const baseURL = reader.result?.toString().replace(/^data:(.*,)?/, "");

        baseURL && uploadFile(file, key, baseURL);
      };
    },
    [uploadFile]
  );

  const uploadFileHandle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
      if (e.target.files) {
        const file = e.target.files[0];
        if (file) {
          getBase64(file, key);
        }
      }
    },
    [getBase64]
  );

  const convertPayloadFieldEdit = useCallback(
    (key: string, values: { [key: string]: any }, field: TFieldDatastore) => {
      switch (field.dataType) {
        case "status":
          return statusList.find((item) => item.status_name === values[key])
            ?.status_id;

        case "select":
        case "radio":
          return field?.options?.find((op) => op.value === values[key])?.o_id;

        case "checkbox":
          const data: string[] = values[key] ? values[key].split(",") : [];
          const value = data.map((item) => {
            return field?.options?.find((op) => op.value === item)?.o_id;
          });
          return value[0] ? [...value] : "";
        case "datetime":
        case "date":
          if (dayjs(values[key], "YYYY-MM-DDTHH:mm:ssz", true).isValid()) {
            return dayjs(values[key])
              .format("YYYY-MM-DDTHH:mm:ssz")
              .toUpperCase();
          }
          return null;
        case "file":
          if (fileIdUpload) {
            return fileIdUpload;
          } else if (values[key]) {
            return [values[key]];
          }
          return null;
        case "autonum":
        case "users":
        case "user":
        case "dslookup":
        case "label":
        case "separator":
        case "calc":
          return null;
        default:
          return values[key];
      }
    },
    [fileIdUpload, statusList]
  );

  const convertdataChipRes = (chip: string) => {
    return (
      <Stack sx={{ maxWidth: "250px" }} direction="row" spacing={1}>
        <Box sx={{ textTransform: "capitalize" }}>
          {chip &&
            chip.split(",").map((chip, index) => (
              <Chip
                sx={{
                  m: 0.5,
                  "& .MuiChip-label": {
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                    textOverflow: "clip",
                    textAlign: "center",
                    width: 250,
                  },
                }}
                key={index}
                label={chip}
              />
            ))}
        </Box>
      </Stack>
    );
  };

  const convertDataCheckbox = useCallback(
    (id: string) => {
      if (fields && id) {
        const dataType = fields[id]?.dataType;
        const data = fields[id];

        if (dataType === "radio") {
          const options = data.options || [];

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                maxWidth: "250px",
              }}
            >
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name={id}
                value={formik.values[id]}
                onChange={formik.handleChange}
              >
                {options.map((item) => (
                  <FormControlLabel
                    key={item.o_id}
                    value={item.value}
                    disabled={actionPanel === "VIEW"}
                    control={
                      <Radio
                        size="small"
                        sx={{
                          "&.Mui-checked": {
                            color: "#07ccb2",
                          },
                        }}
                      />
                    }
                    label={item.value}
                  />
                ))}
              </RadioGroup>
            </Box>
          );
        }
        if (dataType === "checkbox") {
          const options = data.options || [];
          const checked = formik.values[id]
            ? formik.values[id]?.split(",")
            : [];

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                maxWidth: "250px",
              }}
            >
              <FormGroup>
                {options.map((item) => (
                  <FormControlLabel
                    disabled={actionPanel === "VIEW"}
                    key={item.o_id}
                    control={
                      <Checkbox
                        size="small"
                        checked={checked?.includes(item.value)}
                        sx={{
                          "&.Mui-checked": {
                            color: "#07ccb2",
                          },
                        }}
                        onChange={(e) => {
                          let newChecked: string[] = [...checked];
                          if (!e.target.checked) {
                            newChecked = [...checked].filter(
                              (e) => e !== item.value
                            );
                          } else {
                            newChecked.push(item.value);
                          }
                          formik.setFieldValue(id, newChecked.toString());
                        }}
                      />
                    }
                    label={item.value}
                  />
                ))}
              </FormGroup>
            </Box>
          );
        }
        if (dataType === "select" || dataType === "status") {
          const options = data.options || [];

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                maxWidth: "250px",
              }}
            >
              <Select
                fullWidth
                disabled={actionPanel === "VIEW"}
                size="small"
                name={id}
                value={formik.values[id]}
                onChange={formik.handleChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                {dataType === "select"
                  ? options.map((item) => (
                      <MenuItem key={item.o_id} value={item.value}>
                        {item.value}
                      </MenuItem>
                    ))
                  : statusList.map((item) => (
                      <MenuItem key={item.status_id} value={item.status_name}>
                        {item.status_name}
                      </MenuItem>
                    ))}
              </Select>
            </Box>
          );
        }
      }
    },
    [actionPanel, fields, formik, statusList]
  );

  const convertDataFile = useCallback(
    (id: string, key: string) => {
      if (dataFiles) {
        const ids = id?.split(",");

        const dataFileArr: { id: string; name?: string; link?: string }[] = [];
        if (ids && ids[0]) {
          dataFiles.map((item) => {
            if (item.value?.length > 0 && ids?.length > 0) {
              ids.map((id) => {
                item.value.map((file) => {
                  if (file.file_id === id) {
                    dataFileArr.push({
                      id: file.file_id,
                      name: file.filename,
                      link:
                        file.selfLink ||
                        file.mediaLink?.replace("/storage/", "") ||
                        "",
                    });
                  }
                });
              });
            }
          });
        }
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              maxWidth: "250px",
            }}
          >
            {actionPanel === "EDIT" ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button component="label" sx={{ color: "text.highlight" }}>
                  Upload file
                  <input
                    type="file"
                    id="file_upload"
                    name="file_upload"
                    hidden
                    onChange={(e) => {
                      uploadFileHandle(e, key);
                    }}
                  />
                </Button>
                {fileNameUpload ? (
                  <Typography sx={{ width: 150, overflowWrap: "break-word" }}>
                    {fileNameUpload}
                  </Typography>
                ) : (
                  <>
                    {dataFileArr.map((file) => (
                      <Typography
                        key={file.id}
                        sx={{
                          width: 150,
                          overflowWrap: "break-word",
                        }}
                      >
                        {file.name}
                      </Typography>
                    ))}
                  </>
                )}
              </Box>
            ) : (
              <>
                <AttachmentIcon fontSize="small" />
                {dataFileArr.map((file, index) => (
                  <Button
                    key={file.id}
                    sx={{
                      ml: 1,
                      color: "text.highlight",
                    }}
                    onClick={() => downLoadFile(file.id)}
                  >
                    <Typography sx={{ width: 200, overflowWrap: "break-word" }}>
                      {file.name}
                    </Typography>
                  </Button>
                ))}
              </>
            )}
          </Box>
        );
      }
    },
    [actionPanel, dataFiles, downLoadFile, fileNameUpload, uploadFileHandle]
  );

  const convertDataDatetime = useCallback(
    (id: string) => {
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disabled={actionPanel === "VIEW"}
            rifmFormatter={(str: string) =>
              dayjs(str).format("YYYY-MM-DD HH:mm:ss")
            }
            mask="____/__/__ __:__:__"
            inputFormat="YYYY-MM-DD HH:mm:ss"
            value={formik.values[id]}
            onChange={(date) => {
              formik.setFieldValue(id, date);
            }}
            openTo="day"
            views={["year", "month", "day"]}
            renderInput={(params) => (
              <TextField
                id={id}
                name={id}
                {...params}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "5px",
                    backgroundColor: "organization.background.default",
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
      );
    },
    [actionPanel, formik]
  );

  const dataDatastoreUpdateItem = useCallback(
    async (values: { [key: string]: any }) => {
      try {
        const { data } = await datastoreUpdateItem({
          variables: {
            datastoreId: router.query.datastore_id || "",
            projectId: router.query.application_id || "",
            itemId: itemTableSelected?.i_id || "",
            itemActionParameters: values || {},
          },
        });
        if (data) {
          setNotification({
            open: true,
            severity: "success",
            message: "update item datastore success",
          });
          refetchDataItemDetail();
          dataGetDatastoreTable();
        }
      } catch (error) {
        setNotification({
          open: true,
          severity: "error",
          message: "update item datastore error",
        });
      }

      setDatastorePanel({ open: false, action: "HIDE" });
    },
    [
      dataGetDatastoreTable,
      datastoreUpdateItem,
      itemTableSelected?.i_id,
      refetchDataItemDetail,
      router.query.application_id,
      router.query.datastore_id,
      setDatastorePanel,
      setNotification,
    ]
  );

  const dataDatastoreCreateNewItem = useCallback(
    async (values: { [key: string]: any }) => {
      try {
        const { data } = await datastoreCreateNewItem({
          variables: {
            datastoreId: router.query.datastore_id || "",
            projectId: router.query.application_id || "",
            newItemActionParameters: { item: { ...values } } || {},
          },
        });

        if (data) {
          setNotification({
            open: true,
            severity: "success",
            message: "create item datastore success",
          });
          dataGetDatastoreTable();
        }
      } catch (error) {
        setNotification({
          open: true,
          severity: "error",
          message: "update item datastore error",
        });
      }
      setDatastorePanel({ open: false, action: "HIDE" });
    },
    [
      dataGetDatastoreTable,
      datastoreCreateNewItem,
      router.query.application_id,
      router.query.datastore_id,
      setDatastorePanel,
      setNotification,
    ]
  );

  const renderFieldItem = useCallback(
    (dataType: string, key: string, disabled: boolean) => {
      switch (dataType) {
        case "users":
          return convertdataChipRes(itemTableSelected?.[key] as string);

        case "file":
          return convertDataFile(itemTableSelected?.[key] as string, key);

        case "radio":
        case "checkbox":
        case "select":
        case "status":
          return convertDataCheckbox(key);

        case "datetime":
        case "date":
          return convertDataDatetime(key);

        default:
          return (
            <TextField
              name={key}
              value={formik.values[key]}
              onChange={formik.handleChange}
              disabled={disabled}
              multiline={dataColumn[key].dataType === "textarea"}
              minRows={3}
              type={dataColumn[key].dataType === "number" ? "number" : "text"}
              sx={{
                borderRadius: "5px",
                ".MuiOutlinedInput-root": {
                  borderRadius: "5px",
                },
              }}
              fullWidth
              size={"small"}
            />
          );
      }
    },
    [
      convertDataCheckbox,
      convertDataDatetime,
      convertDataFile,
      dataColumn,
      formik.handleChange,
      formik.values,
      itemTableSelected,
    ]
  );

  const renderItemNew = useCallback(
    (dataType: string, key: string) => {
      const disable = false;
      switch (dataType) {
        case "text":
        case "number":
        case "datetime":
        case "date":
        case "textarea":
          return (
            <Box
              key={key}
              sx={{
                fontSize: "14px",
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    maxWidth: "100px",
                    width: "100px",
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: darkMode ? "#fff" : "inherit",
                  }}
                >
                  {dataColumn[key].name}
                </Typography>
                <Typography
                  sx={{
                    maxWidth: "100px",
                    width: "100px",
                    color: "#ACACAE",
                    fontSize: "13px",
                  }}
                >
                  {dataColumn[key].dataType}
                </Typography>
              </Box>
              <Box sx={{ width: "100%", ml: 1 }}>
                {renderFieldItem(dataColumn[key].dataType, key, disable)}
              </Box>
            </Box>
          );

        default:
          return null;
      }
    },
    [darkMode, dataColumn, renderFieldItem]
  );

  const renderItemEdit = useCallback(
    (dataType: string, key: string) => {
      switch (dataType) {
        case "label":
        case "separator":
          return null;

        default:
          const disable = ["autonum", "calc", "dslookup"].includes(dataType);
          return (
            <Box
              key={key}
              sx={{
                fontSize: "14px",
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    maxWidth: "100px",
                    width: "100px",
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: darkMode ? "#fff" : "inherit",
                  }}
                >
                  {dataColumn[key].name}
                </Typography>
                <Typography
                  sx={{
                    maxWidth: "100px",
                    width: "100px",
                    color: "#ACACAE",
                    fontSize: "13px",
                  }}
                >
                  {dataColumn[key].dataType}
                </Typography>
              </Box>
              <Box sx={{ width: "100%", ml: 1 }}>
                {renderFieldItem(dataColumn[key].dataType, key, disable)}
              </Box>
            </Box>
          );
      }
    },
    [darkMode, dataColumn, renderFieldItem]
  );

  const renderItemView = useCallback(
    (dataType: string, key: string) => {
      switch (dataType) {
        case "label":
        case "separator":
          return null;

        default:
          const disable = true;
          return (
            <Box
              key={key}
              sx={{
                fontSize: "14px",
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    maxWidth: "100px",
                    width: "100px",
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: darkMode ? "#fff" : "inherit",
                  }}
                >
                  {dataColumn[key].name}
                </Typography>
                <Typography
                  sx={{
                    maxWidth: "100px",
                    width: "100px",
                    color: "#ACACAE",
                    fontSize: "13px",
                  }}
                >
                  {dataColumn[key].dataType}
                </Typography>
              </Box>
              <Box sx={{ width: "100%", ml: 1 }}>
                {renderFieldItem(dataColumn[key].dataType, key, disable)}
              </Box>
            </Box>
          );
      }
    },
    [darkMode, dataColumn, renderFieldItem]
  );

  const renderItem = useCallback(
    (actionPanel: TActionPanel, dataType: string, key: string) => {
      switch (actionPanel) {
        case "NEW":
          return renderItemNew(dataType, key);
        case "EDIT":
          return renderItemEdit(dataType, key);
        default:
          return renderItemView(dataType, key);
      }
    },
    [renderItemEdit, renderItemNew, renderItemView]
  );

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <MuiDrawer
        variant="persistent"
        open={datastorePanel.open}
        anchor="right"
        sx={{
          "& .MuiDrawer-paper": {
            top: 0,
            position: "relative",
            minWidth: 384,
            boxSizing: "border-box",
            backgroundColor: "background.boxModal",
            borderTop: "1px solid",
            borderColor: darkMode ? "transparent" : "#bdc3c7",
            pb: 5,
            height: "100%",
          },
        }}
      >
        {actionPanel === "VIEW" ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              m: 1,
            }}
          >
            <ButtonConfirm
              buttonType="edit"
              buttonClick={() =>
                setDatastorePanel({ action: "EDIT", open: true })
              }
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <ButtonConfirm
                buttonType="delete"
                buttonClick={() => {
                  setDeleteModal({ type: "deleteDatastoreItem", open: true });
                }}
              />
              <IconButton
                aria-label="more"
                id="long-button"
                aria-haspopup="true"
                onClick={() => {
                  setDatastorePanel({ open: false, action: "HIDE" });
                  setItemTableSelected({});
                }}
                sx={{ ml: 1 }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              m: 1,
            }}
          >
            <Typography>
              {actionPanel === "EDIT" ? "Edit Item" : "Create new Item"}
            </Typography>

            <IconButton
              aria-label="more"
              id="long-button"
              aria-haspopup="true"
              onClick={() => {
                setDatastorePanel({ open: false, action: "HIDE" });
                setItemTableSelected({});
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        <Divider />
        {loading || loadingUploadFile ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              height: "calc(100vh - 100px)",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              height:
                actionPanel !== "VIEW"
                  ? "calc(100vh - 240px)"
                  : "calc(100vh - 200px)",
              overflow: "auto",
              "&::-webkit-scrollbar": {
                width: "0px",
                height: "0px",
              },
            }}
          >
            {dataColumn &&
              itemTableSelected &&
              Object.keys(dataColumn).map((key) =>
                renderItem(actionPanel, dataColumn[key].dataType, key)
              )}
          </Box>
        )}

        {actionPanel !== "VIEW" && (
          <>
            <Divider />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
              }}
            >
              <ButtonConfirm
                buttonType="cancel"
                buttonClick={() => {
                  if (actionPanel === "EDIT") {
                    setDatastorePanel({ open: true, action: "VIEW" });
                  } else {
                    setDatastorePanel({ open: false, action: "HIDE" });
                  }
                }}
              />
              <ButtonConfirm buttonType="save" type="submit" />
            </Box>
          </>
        )}
      </MuiDrawer>
    </Box>
  );
};

export default ItemDatastorePanel;
