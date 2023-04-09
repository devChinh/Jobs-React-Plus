import React, { useCallback, useContext, useEffect, useState } from "react";

import { useMutation } from "@apollo/client";
import { Box } from "@mui/material";
import { ColDef, GridApi, GridReadyEvent } from "ag-grid-community";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { DATASTORE_DELETE_ITEM } from "../../graphql/workspace";
import ColorModeContext from "../../modules/styles/ColorModeContext";
import { datastoreGetDatastoreItemsState } from "../../recoil/atom/datastore";
import {
  dataColumnState,
  datastorePanelState,
  itemTableSelectedState,
  notificationState,
} from "../../recoil/atom/workspace";
import { TDatastoreGetDatastoreItem } from "../../recoil/atom/workspace/types";
import DeleteConfirm from "../modal/deleteConfirm";
import ItemIdRenderer from "./itemIdRenderer";

const ResizeTable: React.FC<{
  dataGetDatastoreTable: () => Promise<void>;
}> = ({ dataGetDatastoreTable }) => {
  const { darkMode } = useContext(ColorModeContext);
  const router = useRouter();

  const [itemTableSelected, setItemTableSelected] = useRecoilState(
    itemTableSelectedState
  );
  const setDatastorePanel = useSetRecoilState(datastorePanelState);
  const setNotification = useSetRecoilState(notificationState);
  const dataColumn = useRecoilValue(dataColumnState);
  const dataTable = useRecoilValue(datastoreGetDatastoreItemsState);

  const [datastoreDeleteItem] = useMutation(DATASTORE_DELETE_ITEM, {
    onError(error) {
      console.error("error", error);
    },
  });

  const [rowDataTable, setRowDataTable] =
    useState<TDatastoreGetDatastoreItem[]>();
  const [columnDataTable, setColumnDataTable] = useState<ColDef[]>();
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const defaultColDef = {
    resizable: true,
  };

  useEffect(() => {
    const dataFields: ColDef[] = [
      {
        field: "i_id",
        headerName: "",
        cellRenderer: ItemIdRenderer,
        width: 80,
        resizable: false,
      },
    ];
    if (dataColumn) {
      Object.keys(dataColumn).forEach((key) => {
        dataFields.push({
          field: key,
          headerName: dataColumn[key].name,
        });
      });
    }
    setColumnDataTable(dataFields);
  }, [dataColumn]);
  useEffect(() => {
    if (dataTable?.datastoreGetDatastoreItems.items) {
      setRowDataTable(dataTable.datastoreGetDatastoreItems.items);
    }
  }, [dataTable.datastoreGetDatastoreItems.items]);

  const dataDatastoreDeleteItem = useCallback(async () => {
    try {
      const { data } = await datastoreDeleteItem({
        variables: {
          datastoreId: router.query.datastore_id || "",
          projectId: router.query.application_id || "",
          itemId: itemTableSelected?.i_id || "",
          deleteItemReq: {
            use_display_id: true,
            delete_linked_items: true,
            u_id: null,
            a_id: null,
            target_datastores: null,
          },
        },
      });

      if (data) {
        setNotification({
          open: true,
          severity: "success",
          message: "delete item datastore success",
        });
        dataGetDatastoreTable();
      }
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: "delete item datastore error",
      });
    }
  }, [
    dataGetDatastoreTable,
    datastoreDeleteItem,
    itemTableSelected?.i_id,
    router.query.application_id,
    router.query.datastore_id,
    setNotification,
  ]);

  const handleDeleteItem = () => {
    dataDatastoreDeleteItem();
    setDatastorePanel({ action: "HIDE", open: false });
  };

  useEffect(() => {
    if (!itemTableSelected.rev_no && gridApi) {
      gridApi.deselectAll();
    }
  }, [gridApi, itemTableSelected]);

  return (
    <Box
      className={darkMode ? "ag-theme-balham-dark" : "ag-theme-balham"}
      sx={{
        height: "100%",
        maxHeight: "86vh",
        width: "100%",
        maxWidth: "calc(100% - 58px)",
      }}
    >
      <AgGridReact
        defaultColDef={defaultColDef}
        rowData={rowDataTable}
        columnDefs={columnDataTable}
        onGridReady={(params: GridReadyEvent) => setGridApi(params.api)}
        rowSelection={"single"}
        onCellClicked={(e) => {
          const field = e.colDef.field;
          const data = e.data;
          setItemTableSelected(data);
          if (field !== "i_id") {
            setDatastorePanel({ action: "VIEW", open: true });
          }
        }}
      ></AgGridReact>
      <DeleteConfirm handleDeleteField={handleDeleteItem} />
    </Box>
  );
};
export default ResizeTable;
