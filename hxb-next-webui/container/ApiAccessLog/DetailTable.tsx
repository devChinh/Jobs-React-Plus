import "@uiw/react-textarea-code-editor/dist.css";

import dynamic from "next/dynamic";
import React, { useContext, useEffect, useRef, useState } from "react";

import { useTranslation } from "next-i18next";

import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";

import ColorModeContext from "../../modules/styles/ColorModeContext";
import { TAnalyticsUsageApi } from "../../recoil/atom/log/types";
import { BoxDetail, TextContentDetail, TextTitleDetail } from "./style";

const CodeEditor = dynamic<any>(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);

interface PanelRightProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  apiAccessSelected?: TAnalyticsUsageApi;
  setApiAcceSelected: React.Dispatch<
    React.SetStateAction<TAnalyticsUsageApi | undefined>
  >;
}

const DetailTable: React.FC<PanelRightProps> = ({
  open,
  setOpen,
  apiAccessSelected,
  setApiAcceSelected,
}) => {
  const { darkMode } = useContext(ColorModeContext);
  const { t } = useTranslation("log");

  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [panelWidth, setPanelWidth] = useState<number>(550);

  const isResizingRef = useRef(false);
  isResizingRef.current = isResizing;

  const handleMousedown = (e: any) => {
    setIsResizing(true);
  };

  const handleMousemove = (e: any) => {
    if (!isResizingRef.current) {
      return;
    }

    let offsetRight =
      document.body.offsetWidth - (e.clientX - document.body.offsetLeft);
    let minWidth = 550;
    let maxWidth = 1250;
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
      variant="persistent"
      open={open}
      anchor="right"
      onClose={() => setOpen(false)}
      sx={{
        "& .MuiDrawer-paper": {
          position: "relative",
          whiteSpace: "nowrap",
          width: panelWidth,
          borderTop: "1px solid",
          borderColor: darkMode ? "transparent" : "#bdc3c7",
          backgroundColor: "background.boxModal",
          boxSizing: "border-box",
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
    >
      <Box
        sx={{
          justifyContent: "space-between",
          backgroundColor: "background.boxModal",
          p: 1,
        }}
      >
        <Box sx={{ textAlign: "right" }}>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-haspopup="true"
            onClick={() => {
              setOpen(false);
              setApiAcceSelected(undefined);
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ fontSize: "14px", mb: 3 }}>
          {apiAccessSelected && (
            <>
              <BoxDetail>
                <TextTitleDetail
                  sx={{
                    color: darkMode ? "#fff" : "inherit",
                  }}
                >
                  {t("access_time")}
                </TextTitleDetail>
                <TextContentDetail>
                  {apiAccessSelected.created_at}
                </TextContentDetail>
              </BoxDetail>
              <BoxDetail>
                <TextTitleDetail
                  sx={{
                    color: darkMode ? "#fff" : "inherit",
                  }}
                >
                  {t("status")}
                </TextTitleDetail>
                <TextContentDetail>
                  {apiAccessSelected.status_code}
                </TextContentDetail>
              </BoxDetail>
              <BoxDetail>
                <TextTitleDetail
                  sx={{
                    color: darkMode ? "#fff" : "inherit",
                  }}
                >
                  {t("method")}
                </TextTitleDetail>
                <TextContentDetail>
                  {apiAccessSelected.method}
                </TextContentDetail>
              </BoxDetail>
              <BoxDetail>
                <TextTitleDetail
                  sx={{
                    color: darkMode ? "#fff" : "inherit",
                  }}
                >
                  {t("url")}
                </TextTitleDetail>
                <TextContentDetail>
                  {apiAccessSelected.api_path}
                </TextContentDetail>
              </BoxDetail>
              <BoxDetail>
                <TextTitleDetail
                  sx={{
                    color: darkMode ? "#fff" : "inherit",
                  }}
                >
                  {t("user")}
                </TextTitleDetail>
                <TextContentDetail>
                  {apiAccessSelected.username}
                </TextContentDetail>
              </BoxDetail>
              <BoxDetail>
                <TextTitleDetail
                  sx={{
                    color: darkMode ? "#fff" : "inherit",
                  }}
                >
                  {t("workspace")}
                </TextTitleDetail>
                <TextContentDetail>
                  {apiAccessSelected.workspace_name}
                </TextContentDetail>
              </BoxDetail>
              <BoxDetail>
                <TextTitleDetail
                  sx={{
                    color: darkMode ? "#fff" : "inherit",
                  }}
                >
                  {t("latency")}
                </TextTitleDetail>
                <TextContentDetail>
                  {apiAccessSelected.latency}ms
                </TextContentDetail>
              </BoxDetail>
              {/* <BoxDetail>
                <TextTitleDetail
                  sx={{
                    color: darkMode ? "#fff" : "inherit",
                  }}
                >
                  Host
                </TextTitleDetail>
                <TextContentDetail>{apiAccessSelected.host}</TextContentDetail>
              </BoxDetail>
              <BoxDetail>
                <TextTitleDetail
                  sx={{
                    color: darkMode ? "#fff" : "inherit",
                  }}
                >
                  Soure IP
                </TextTitleDetail>
                <TextContentDetail>
                  {apiAccessSelected.source_ip}
                </TextContentDetail>
              </BoxDetail> */}
              <BoxDetail>
                <TextTitleDetail
                  sx={{
                    color: darkMode ? "#fff" : "inherit",
                  }}
                >
                  {t("payload")}
                </TextTitleDetail>
                  <Box sx={{width : "100%"}}>
                    <CodeEditor
                      value={
                        apiAccessSelected.payload
                          ? JSON.stringify(
                              JSON.parse(apiAccessSelected.payload),
                              null,
                              "\t"
                            )
                          : ""
                      }
                      language="tsx"
                      padding={15}
                      style={{
                        fontSize: 14,
                        fontWeight: 400,
                        lineHeight: "17.6px",
                        letterSpacing: "0.3px",
                        fontFamily: "Source Code Pro",
                        borderRadius: "5px",
                      }}
                    />
                  </Box>
              </BoxDetail>
            </>
          )}
        </Box>
      </Box>
      <div
        onMouseDown={(e: any) => {
          handleMousedown(e);
        }}
        className="dragger"
        style={{ height: "100%" }}
      ></div>
    </MuiDrawer>
  );
};

export default DetailTable;
