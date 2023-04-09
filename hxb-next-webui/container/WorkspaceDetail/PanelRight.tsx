import { useRouter } from "next/router";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Link,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { useTranslation } from "next-i18next";
import { useRecoilValue } from "recoil";

import CommonTextAria from "../../components/textAria";
import {
  DATASTORE_CREATE_NEW_ITEM,
  DATASTORE_DELETE_ITEM,
  DATASTORE_GET_DATASTORE_ITEM,
  DATASTORE_UPDATE_ITEM,
  GET_DATASTORE_ITEM_DETAILS,
} from "../../graphql/workspace";
import ColorModeContext from "../../modules/styles/ColorModeContext";
import {
  datastorePanelState,
  itemTableSelectedState,
} from "../../recoil/atom/workspace";

type TApi = {
  id: string;
  title: string;
  description: string;
  content: string;
  payload: string;
};

const PanelRight: React.FC<{}> = () => {
  const { t } = useTranslation("workspace");
  const { darkMode } = useContext(ColorModeContext);
  const router = useRouter();

  const itemTableSelected = useRecoilValue(itemTableSelectedState);
  const datastorePanel = useRecoilValue(datastorePanelState);

  const [datastoreGetDatastoreItem] = useMutation(
    DATASTORE_GET_DATASTORE_ITEM,
    {
      onError(error) {
        setStatusRes(error.message);
        setDataResApi("");
        setOpenResApi(true);
      },
    }
  );

  const [datastoreCreateNewItem] = useMutation(DATASTORE_CREATE_NEW_ITEM, {
    onError(error) {
      setStatusRes(error.message);
      setDataResApi("");
      setOpenResApi(true);
    },
  });
  const [datastoreUpdateItem] = useMutation(DATASTORE_UPDATE_ITEM, {
    onError(error) {
      setStatusRes(error.message);
      setDataResApi("");
      setOpenResApi(true);
    },
  });
  const [datastoreDeleteItem] = useMutation(DATASTORE_DELETE_ITEM, {
    onError(error) {
      setStatusRes(error.message);
      setDataResApi("");
      setOpenResApi(true);
    },
  });

  const [getDatastoreItemDetails] = useLazyQuery(GET_DATASTORE_ITEM_DETAILS, {
    onError(error) {
      setStatusRes(error.message);
      setDataResApi("");
      setOpenResApi(true);
    },
  });

  const APIsInitial = useMemo(() => {
    const applicationId = router.query.application_id;
    const datastoreId = router.query.datastore_id;

    if (datastorePanel.open) {
      return [
        {
          id: "item_get",
          title: "Get Item",
          description: "Get Item",
          content: `/api/v0/applications/${applicationId}/datastores/${datastoreId}/items/details/${itemTableSelected?.i_id}`,
          payload: JSON.stringify(
            {
              format: "map",
              use_display_id: true,
              include_linked_items: true,
              include_lookups: true,
              return_number_value: true,
            },
            undefined,
            2
          ),
        },
        {
          id: "item_update",
          title: "Update Item",
          description: "Update Item",
          content: `/api/v0/applications/${applicationId}/datastores/${datastoreId}/items/edit/${itemTableSelected?.i_id}`,
          payload: JSON.stringify(
            {
              rev_no: 1,
              is_force_update: true,
              comment: null,
              use_display_id: false,
              return_item_result: true
            },
            undefined,
            2
          ),
        },
        {
          id: "item_delete",
          title: "Delete Item",
          description: "Delete Item",
          content: `/api/v0/applications/${applicationId}/datastores/${datastoreId}/items/delete/${itemTableSelected?.i_id}`,
          payload: JSON.stringify(
            {
            },
            undefined,
            2
          ),
        },
      ];
    } else {
      return [
        {
          id: "datastore_get_items",
          title: "Get Items",
          description: "Get items",
          content: `/api/v0/applications/${applicationId}/datastores/${datastoreId}/items/search`,
          payload: JSON.stringify(
            {
              conditions: null,
              page: 1,
              per_page: 0,
            },
            undefined,
            2
          ),
        },
        {
          id: "datastore_create_item",
          title: "Create new Item",
          description: "Create new item",
          content: `/api/v0/applications/${applicationId}/datastores/${datastoreId}/items/new`,
          payload: JSON.stringify(
            {
              item: {
                field_id: "登録データ",
                title: "タイトル",
                assignee: "担当者",
              },
            },
            undefined,
            2
          ),
        },
      ];
    }
  }, [
    itemTableSelected,
    datastorePanel,
    router.query.application_id,
    router.query.datastore_id,
  ]);

  const [ApiSelected, setApiSelected] = useState<TApi>(APIsInitial[0]);
  const [openResApi, setOpenResApi] = useState<boolean>(false);
  const [dataResApi, setDataResApi] = useState<string>("");
  const [payloadApi, setPayloadApi] = useState<string>("");
  const [statusRes, setStatusRes] = useState<string>();
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [panelWidth, setPanelWidth] = useState<number>(300);
  const isResizingRef = useRef(false);
  isResizingRef.current = isResizing;

  const getDataDatastoreGetDatastoreItem = useCallback(async () => {
    try {
      const dataRes = await datastoreGetDatastoreItem({
        variables: {
          datastoreId: router.query.datastore_id || "",
          projectId: router.query.application_id || "",
          getItemsParameters: JSON.parse(payloadApi) || {},
        },
      });

      if (dataRes.data) {
        const replacer = (key: string, value: any) => {
          if (key === "__typename") {
            return undefined;
          }
          return value;
        };
        const responseBody = JSON.stringify(
          dataRes.data.datastoreGetDatastoreItems,
          replacer,
          2
        );
        setDataResApi(responseBody);
        setStatusRes("200");
        setOpenResApi(true);
      }
    } catch (error) {
      setStatusRes("error");
      setDataResApi("");
      setOpenResApi(true);
    }
  }, [
    datastoreGetDatastoreItem,
    payloadApi,
    router.query.application_id,
    router.query.datastore_id,
  ]);

  const dataDatastoreCreateNewItem = useCallback(async () => {
    try {
      const dataRes = await datastoreCreateNewItem({
        variables: {
          datastoreId: router.query.datastore_id || "",
          projectId: router.query.application_id || "",
          newItemActionParameters: JSON.parse(payloadApi) || {},
        },
      });

      if (dataRes.data) {
        const replacer = (key: string, value: any) => {
          if (key === "__typename") {
            return undefined;
          }
          return value;
        };
        const responseBody = JSON.stringify(
          dataRes.data.datastoreCreateNewItem,
          replacer,
          2
        );
        setDataResApi(responseBody);
        setStatusRes("200");
        setOpenResApi(true);
      }
    } catch (error) {
      setStatusRes("error");
      setDataResApi("");
      setOpenResApi(true);
    }
  }, [
    datastoreCreateNewItem,
    payloadApi,
    router.query.application_id,
    router.query.datastore_id,
  ]);

  const dataGetDatastoreItemDetails = useCallback(async () => {
    try {
      const dataRes = await getDatastoreItemDetails({
        variables: {
          datastoreId: router.query.datastore_id || "",
          projectId: router.query.application_id || "",
          itemId: itemTableSelected?.i_id || "",
          datastoreItemDetailParams: JSON.parse(payloadApi) || {},
        },
      });

      if (dataRes.data) {
        const replacer = (key: string, value: any) => {
          if (key === "__typename") {
            return undefined;
          }
          return value;
        };
        const responseBody = JSON.stringify(
          dataRes.data.getDatastoreItemDetails,
          replacer,
          2
        );
        setDataResApi(responseBody);
        setStatusRes("200");
        setOpenResApi(true);
      }
    } catch (error) {
      setStatusRes("error");
      setDataResApi("");
      setOpenResApi(true);
    }
  }, [
    getDatastoreItemDetails,
    itemTableSelected?.i_id,
    payloadApi,
    router.query.application_id,
    router.query.datastore_id,
  ]);

  const dataDatastoreUpdateItem = useCallback(async () => {
    try {
      const dataRes = await datastoreUpdateItem({
        variables: {
          datastoreId: router.query.datastore_id || "",
          projectId: router.query.application_id || "",
          itemId: itemTableSelected?.i_id || "",
          itemActionParameters: JSON.parse(payloadApi) || {},
        },
      });

      if (dataRes.data) {
        const replacer = (key: string, value: any) => {
          if (key === "__typename") {
            return undefined;
          }
          return value;
        };
        const responseBody = JSON.stringify(
          dataRes.data.datastoreUpdateItem,
          replacer,
          2
        );
        setDataResApi(responseBody);
        setStatusRes("200");
        setOpenResApi(true);
      }
    } catch (error) {
      setStatusRes("error");
      setDataResApi("");
      setOpenResApi(true);
    }
  }, [
    datastoreUpdateItem,
    itemTableSelected?.i_id,
    payloadApi,
    router.query.application_id,
    router.query.datastore_id,
  ]);

  const dataDatastoreDeleteItem = useCallback(async () => {
    try {
      const dataRes = await datastoreDeleteItem({
        variables: {
          datastoreId: router.query.datastore_id || "",
          projectId: router.query.application_id || "",
          itemId: itemTableSelected?.i_id || "",
          deleteItemReq: JSON.parse(payloadApi) || {},
        },
      });

      if (dataRes.data) {
        const replacer = (key: string, value: any) => {
          if (key === "__typename") {
            return undefined;
          }
          return value;
        };
        const responseBody = JSON.stringify(
          dataRes.data.datastoreDeleteItem,
          replacer,
          2
        );
        setDataResApi(responseBody);
        setStatusRes("200");
        setOpenResApi(true);
      }
    } catch (error) {
      setStatusRes("error");
      setDataResApi("");
      setOpenResApi(true);
    }
  }, [
    datastoreDeleteItem,
    itemTableSelected?.i_id,
    payloadApi,
    router.query.application_id,
    router.query.datastore_id,
  ]);

  useEffect(() => {
    setApiSelected(APIsInitial[0]);
  }, [APIsInitial]);

  useEffect(() => {
    setOpenResApi(false);
    setStatusRes(undefined);
    setDataResApi("");
    setPayloadApi(ApiSelected.payload);
  }, [ApiSelected]);

  const handleClickRunButton = () => {
    const { id } = ApiSelected;
    switch (id) {
      case "datastore_get_items":
        getDataDatastoreGetDatastoreItem();
        break;
      case "datastore_create_item":
        dataDatastoreCreateNewItem();
        break;
      case "item_get":
        dataGetDatastoreItemDetails();
        break;
      case "item_update":
        dataDatastoreUpdateItem();
        break;
      case "item_delete":
        dataDatastoreDeleteItem();
        break;
      default:
        break;
    }
  };

  const handleMousedown = (e: any) => {
    setIsResizing(true);
  };

  const handleMousemove = (e: any) => {
    if (!isResizingRef.current) {
      return;
    }

    let offsetRight =
      document.body.offsetWidth - (e.clientX - document.body.offsetLeft);
    let minWidth = 50;
    let maxWidth = 800;
    if (offsetRight > minWidth && offsetRight < maxWidth) {
      setPanelWidth(offsetRight);
    }
  };

  const handleMouseup = (e: any) => {
    setIsResizing(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", (e) => handleMousemove(e));
    window.addEventListener("mouseup", (e) => handleMouseup(e));
  }, []);

  return (
    <MuiDrawer
      sx={{
        "& .MuiDrawer-paper": {
          position: "relative",
          whiteSpace: "nowrap",
          width: panelWidth,
          borderTop: "1px solid",
          borderColor: darkMode ? "transparent" : "#bdc3c7",
          backgroundColor: "background.boxModal",
          boxSizing: "border-box",
          height: "calc(100vh - 128px)",
          overflowY: "auto",
          padding: "0 6px 0 10px",
          "&::-webkit-scrollbar": {
            width: "0px",
            height: "0px",
          },
          ".dragger": {
            width: "5px",
            cursor: "ew-resize",
            padding: "4px 0 0",
            borderTop: "1px solid #ddd",
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: "100",
            backgroundColor: darkMode ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.05)",
            border: "none",
            borderRight: "solid 1px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            "&::before,&::after": {
              content: '""',
              width: "1px",
              height: "1px",
              backgroundColor: "#666",
              display: "block",
              margin: "1.5px",
            },
          },
        },
      }}
      variant="permanent"
      open={true}
      anchor="right"
    >
      <Box
        sx={{
          justifyContent: "space-between",
          backgroundColor: "background.boxModal",
          p: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontSize: "14px" }}>
          {t("api_playground_panel")}
        </Typography>
        <Box>
          <FormControl
            sx={{
              color: "text.primary",
              height: "26px",
              maxWidth: "100%",
            }}
          >
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              value={ApiSelected.title}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              size="small"
              sx={{
                backgroundColor: "background.boxModal",
                color: "text.select",
                mt: 1,
                border: "1px solid",
                borderColor: "#555558",
                borderRadius: "5px",
                fontWeight: "bold",
                width: "240px",
                maxWidth: "100%",
                ".MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              {APIsInitial &&
                APIsInitial.map((item) => (
                  <MenuItem
                    key={item.id}
                    value={item.title}
                    onClick={() => setApiSelected(item)}
                  >
                    {item.title}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText
              sx={{
                fontSize: "14px",
                color: "workspace.text.box",
                fontWeight: "normal",
                opacity: "0.5",
                marginLeft: "0",
              }}
            >
              {t("description")}: {ApiSelected.description}
            </FormHelperText>
          </FormControl>
        </Box>
        <Box
          sx={{
            backgroundColor: "workspace.background.box",
            padding: "10px 10px 7px",
            mt: 7,
            color: "workspace.text.box",
            borderRadius: "6px",
          }}
        >
          <Box
            component="div"
            sx={{
              overflowX: "scroll",
              fontSize: "14px",
              "&::-webkit-scrollbar": {
                width: "10px",
              },
              "&::-webkit-scrollbar-track": {
                borderRadius: "10px",
                background: "rgba(0,0,0,0.05)",
              },
              "&::-webkit-scrollbar-thumb": {
                borderRadius: "10px",
                background: "rgba(0,0,0,0.2)",
              },
            }}
          >
            {ApiSelected.content}
          </Box>
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{ mt: 2, color: "text.highlight", fontSize: "15px" }}
          >
            {t("payload")}
          </Typography>
          <CommonTextAria
            data={payloadApi}
            setPayloadApi={setPayloadApi}
            borderColor="#0ACCB2"
          />
          <Box sx={{ textAlign: "right" }}>
            <Link
              href="https://apidoc.hexabase.com/docs/"
              color="inherit"
              sx={{
                fontSize: "12px",
                mt: 1,
              }}
            >
              &gt;More information (API Reference)
            </Link>
          </Box>
        </Box>
        <Box>
          <Button
            sx={{
              backgroundColor: "background.highlight",
              color: "#ffffff",
              width: "100%",
              mt: 2,
              "&:hover": {
                backgroundColor: "#6AE79C",
              },
            }}
            onClick={handleClickRunButton}
          >
            {t("run")}
          </Button>

          <Typography sx={{ mt: 2, color: "text.highlight" }}>
            {t("response")}
          </Typography>
          {!openResApi ? (
            <Typography>{t("please_run")} ...</Typography>
          ) : (
            <Box>
              <Typography sx={{ fontSize: "13px" }}>{t("status")}</Typography>
              <Typography whiteSpace="normal" sx={{ fontSize: "12px", ml: 1 }}>
                {statusRes}
              </Typography>
              <Typography sx={{ mt: 2, fontSize: "13px" }}>
                {t("body")}
              </Typography>
              <CommonTextAria data={dataResApi} />
            </Box>
          )}
        </Box>
      </Box>
      <div
        onMouseDown={(e: any) => {
          handleMousedown(e);
        }}
        className="dragger"
      ></div>
    </MuiDrawer>
  );
};

export default PanelRight;
