import { useRouter } from "next/router";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useLazyQuery, useMutation } from "@apollo/client";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import {
  DATASTORE_CREATE_FIELD,
  DATASTORE_DELETE_FIELD,
  DATASTORE_GET_FIELD,
  DATASTORE_ROLES_QUERY,
} from "../../../graphql/datastore";
import {
  DataStoreGetField,
  TDatastoreCreateFieldPayload,
  TDatastoreSetting,
  TField,
  TGetDatastoreSetting,
} from "../../../recoil/atom/datastore/types";
import {
  datastoreFieldsState,
  datastoreSelectedState,
  deleteModalState,
  notificationState,
} from "../../../recoil/atom/workspace";
import ButtonConfirm from "../../buttonConfirm";
import DeleteConfirm from "../deleteConfirm";
import MenuMoreVert from "../menuMoreVert";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      minWidth: 200,
    },
  },
};

interface Props {
  setOpenModalSetting?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TabFieldsModal: React.FC<Props> = ({ setOpenModalSetting }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const [getFieldDataStore] =
    useLazyQuery<DataStoreGetField>(DATASTORE_GET_FIELD);

  const [datastoreFields, setDatastoreFields] =
    useRecoilState(datastoreFieldsState);
  const datastoreSelected = useRecoilValue(datastoreSelectedState);
  const setNotification = useSetRecoilState(notificationState);
  const setDeleteModal = useSetRecoilState(deleteModalState);

  const fieldDefaults: TField[] | undefined = useMemo(() => {
    if (datastoreFields) return Object.values(datastoreFields);
  }, [datastoreFields]);
  const types = useMemo(() => {
    const typeArr: string[] = [];
    if (datastoreFields) {
      Object.values(datastoreFields).map((field) => {
        const fieldFilter = typeArr.find((type) => type === field.dataType);
        !fieldFilter && typeArr.push(field.dataType);
      });
    }
    return typeArr;
  }, [datastoreFields]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const [openModalDeleteConfirm, setOpenModalDeleteConfirm] = useState(false);
  const [fields, setFields] = useState<TField[]>();
  const [indexFieldSelected, setIndexFieldSelected] = useState(-1);
  const [datastoreSetting, setDatastoreSetting] = useState<TDatastoreSetting>();
  const datastoreRoles = useMemo(() => {
    const roles: string[] = [];
    datastoreSetting?.roles.map((role) => roles.push(role.id));
    return roles;
  }, [datastoreSetting]);
  const [fieldAddNew, setFieldAddNew] =
    useState<TDatastoreCreateFieldPayload>();
  const [disableButtonAddField, setDisableButtonAddField] =
    useState<boolean>(false);
  const [datastoreFieldIdSelected, setDatastoreFieldIdSelected] =
    useState<string>();

  const openMoreIcon = Boolean(anchorEl);
  const idMoreIcon = openMoreIcon ? "simple-popover" : undefined;

  const [getDatastoreRoles] = useLazyQuery<TGetDatastoreSetting>(
    DATASTORE_ROLES_QUERY
  );
  const [createDatastoreField] = useMutation(DATASTORE_CREATE_FIELD);
  const [deleteDatastoreField] = useMutation(DATASTORE_DELETE_FIELD);

  const handleClickMoreIcon = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const getDataDatastoreFields = useCallback(async () => {
    try {
      const { data } = await getFieldDataStore({
        variables: {
          datastoreId: datastoreSelected.datastore_id,
          projectId: router.query.application_id,
        },
      });

      setDatastoreFields(data?.datastoreGetFields?.fields);
    } catch (error) {
      console.error("error", error);
    }
  }, [
    getFieldDataStore,
    datastoreSelected.datastore_id,
    router.query.application_id,
    setDatastoreFields,
  ]);

  const handleCreateDatastoreField = async () => {
    try {
      const { data } = await createDatastoreField({
        variables: {
          datastoreId: datastoreSelected.datastore_id,
          payload: fieldAddNew,
        },
      });
      if (data) {
        getDataDatastoreFields && getDataDatastoreFields();
        setNotification({
          open: true,
          severity: "success",
          message: "add field successfully",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: "add field error",
      });
    }
  };

  const handleDeleteDatastoreField = async (fieldId: string) => {
    try {
      const { data } = await deleteDatastoreField({
        variables: {
          datastoreId: datastoreSelected.datastore_id,
          fieldId: fieldId,
        },
      });
      if (data) {
        getDataDatastoreFields && getDataDatastoreFields();
        setNotification({
          open: true,
          severity: "success",
          message: "delete field successfully",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: "delete field error",
      });
    }
  };

  const handleAddNewField = () => {
    if (fields) {
      const newFields = [...fields];
      newFields.push({
        display_id: null,
        name: "",
        dataType: "",
        has_index: false,
        unique: false,
      });
      setFields(newFields);
    }
  };

  const handleChangeFieldValue = (
    e:
      | SelectChangeEvent<string>
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    if (fields) {
      let fieldTemps = [...fields];

      if (e.target.name === "dataType")
        fieldTemps[index].dataType = e.target.value;

      if (e.target.name === "display_id")
        fieldTemps[index].display_id = e.target.value;

      if (e.target.name === "name") fieldTemps[index].name = e.target.value;

      if (e.target.name === "has_index")
        fieldTemps[index].has_index = !fieldTemps[index].has_index;

      if (e.target.name === "unique")
        fieldTemps[index].unique = !fieldTemps[index].unique;

      setFields(fieldTemps);
    }
  };

  const handleDeleteField = () => {
    if (fields && !datastoreFieldIdSelected) {
      const fieldTemps = [...fields];
      fieldTemps.splice(indexFieldSelected, 1);
      setFields(fieldTemps);
    } else {
      datastoreFieldIdSelected &&
        handleDeleteDatastoreField(datastoreFieldIdSelected);
    }
    setAnchorEl(null);
  };

  const handleClickCancel = () => {
    setAnchorEl(null);
  };

  const dataGetDatastoreRoles = useCallback(async () => {
    try {
      const { data } = await getDatastoreRoles({
        variables: {
          datastoreId: datastoreSelected.datastore_id,
        },
      });

      setDatastoreSetting(data?.datastoreSetting);
    } catch (error) {
      console.error("error", error);
    }
  }, [datastoreSelected.datastore_id, getDatastoreRoles]);

  const validateDisplayId = (
    display_id: string | null,
    field_id: string | undefined
  ) => {
    if (
      fieldDefaults?.find(
        (field) =>
          field.field_id !== field_id && field.display_id === display_id
      )
    )
      return true;

    return false;
  };

  const fieldFound = useCallback(
    (field_id: string | undefined, display_id: string | null) => {
      if (
        fieldDefaults?.find(
          (field) =>
            field.field_id === field_id && field.display_id === display_id
        )
      )
        return true;

      return false;
    },
    [fieldDefaults]
  );

  useEffect(() => {
    getDataDatastoreFields();
  }, [getDataDatastoreFields]);

  useEffect(() => {
    dataGetDatastoreRoles();
  }, [dataGetDatastoreRoles]);

  useEffect(() => {
    setDisableButtonAddField(false);
    setFieldAddNew(undefined);
    fields?.map((field) => {
      if (!fieldFound(field.field_id, field.display_id)) {
        setDisableButtonAddField(true);
        setFieldAddNew({
          name: {
            en: field.name,
            ja: "",
          },
          dataType: field.dataType,
          unique: field.unique,
          has_index: field.has_index,
          roles: datastoreRoles,
          display_id: field.display_id,
        });
      }
    });
  }, [fields, fieldDefaults, datastoreRoles, fieldFound]);

  useEffect(() => {
    setFields(fieldDefaults);
  }, [fieldDefaults]);

  const fieldsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (fieldsEndRef && fieldsEndRef.current) {
        fieldsEndRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 30);
  }, [fields?.length]);

  return (
    <Box>
      <Paper
        sx={{
          width: "75%",
          boxShadow: "none",
          border: "none",
        }}
      >
        <TableContainer
          sx={{
            backgroundColor: "background.modal",
            boxShadow: "none",
            height: "250px",
          }}
        >
          <Table
            sx={{
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
                <TableCell sx={{ p: 1 }}>{t("field_id")}</TableCell>
                <TableCell sx={{ p: 1 }}>{t("field_name")}</TableCell>
                <TableCell sx={{ p: 1 }}>{t("type")}</TableCell>
                <TableCell sx={{ p: 1 }}>{t("index")}</TableCell>
                <TableCell sx={{ p: 1 }}>{t("unique")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fields &&
                fields.map((row, index) => (
                  <TableRow
                    key={row.field_id}
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
                        borderBottom: "none",
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
                    <TableCell
                      sx={{ pl: 1, borderBottom: "none" }}
                      component="th"
                      scope="row"
                    >
                      <TextField
                        id="display_id"
                        name="display_id"
                        type="id"
                        value={row.display_id}
                        onChange={(e) => handleChangeFieldValue(e, index)}
                        size="small"
                        error={validateDisplayId(row.display_id, row.field_id)}
                        helperText={
                          validateDisplayId(row.display_id, row.field_id) &&
                          "display_id already exists"
                        }
                        sx={{
                          minWidth: "150px",
                          backgroundColor: "background.tabSelected",
                          borderRadius: "10px",
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ pl: 1, borderBottom: "none" }}
                      component="th"
                      scope="row"
                    >
                      <TextField
                        id="name"
                        name="name"
                        value={row.name}
                        onChange={(e) => handleChangeFieldValue(e, index)}
                        size="small"
                        sx={{
                          minWidth: "150px",
                          backgroundColor: "background.tabSelected",
                          borderRadius: "10px",
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ pl: 1, borderBottom: "none" }}
                      component="th"
                      scope="row"
                    >
                      <FormControl
                        size="small"
                        sx={{
                          width: 200,
                          backgroundColor: "background.tabSelected",
                          borderRadius: "10px",
                        }}
                      >
                        <Select
                          id="dataType"
                          name="dataType"
                          value={row.dataType}
                          onChange={(e) => handleChangeFieldValue(e, index)}
                          input={<OutlinedInput />}
                          MenuProps={MenuProps}
                          inputProps={{ "aria-label": "Without label" }}
                          disabled={fieldFound(row.field_id, row.display_id)}
                        >
                          {types &&
                            types.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell
                      sx={{ pl: 1, borderBottom: "none" }}
                      padding="checkbox"
                    >
                      <Checkbox
                        id="has_index"
                        name="has_index"
                        {...label}
                        defaultChecked={row.has_index}
                        onChange={(e) => handleChangeFieldValue(e, index)}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ pl: 1, borderBottom: "none" }}
                      padding="checkbox"
                    >
                      <Checkbox
                        id="unique"
                        name="unique"
                        {...label}
                        disabled={fieldFound(row.field_id, row.display_id)}
                        checked={row.unique}
                        onChange={(e) => handleChangeFieldValue(e, index)}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        textAlign: "right",
                        width: "15px",
                        borderBottom: "none",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-haspopup="true"
                        aria-describedby={idMoreIcon}
                        onClick={(e) => {
                          setIndexFieldSelected(index);
                          handleClickMoreIcon(e);
                          setDatastoreFieldIdSelected(row.field_id);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div ref={fieldsEndRef} />
        </TableContainer>
      </Paper>
      <Button
        sx={{
          backgroundColor: "organization.background.default",
          border: "1px solid #ACACAE",
          color: "text.primary",
          textTransform: "none",
          mt: 1,
        }}
        onClick={handleAddNewField}
        disabled={disableButtonAddField}
      >
        + {t("add_new_field")}
      </Button>
      <Box sx={{ pl: 3 }}>
        <ButtonConfirm
          buttonType="save"
          buttonClick={() => handleCreateDatastoreField()}
        />
        <ButtonConfirm
          buttonType="cancel"
          buttonClick={() => setOpenModalSetting && setOpenModalSetting(false)}
        />
      </Box>
      <DeleteConfirm
        handleDeleteField={handleDeleteField}
        handleClickCancel={handleClickCancel}
      />
      <MenuMoreVert
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        textDelete={t("delete")}
        setOpenModalDeleteConfirm={setDeleteModal}
      />
    </Box>
  );
};

export default TabFieldsModal;
