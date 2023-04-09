import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState, useContext } from "react";

import { useQuery } from "@apollo/client";
import AttachmentIcon from "@mui/icons-material/Attachment";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Chip, IconButton, Link, Stack, Typography } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { useRecoilState, useRecoilValue } from "recoil";

import { GET_DATASTORE_ITEM_DETAILS } from "../../graphql/workspace";
import { TFileTypeField } from "../../recoil/atom/datastore/types";
import {
  dataColumnState,
  itemTableSelectedState,
} from "../../recoil/atom/workspace";
import ColorModeContext from "../../modules/styles/ColorModeContext";

interface RecordRightProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RecordRight: React.FC<RecordRightProps> = ({ open, setOpen }) => {
  const router = useRouter();
  const { darkMode } = useContext(ColorModeContext);

  const [itemTableSelected, setItemTableSelected] = useRecoilState(
    itemTableSelectedState
  );
  const dataColumn = useRecoilValue(dataColumnState);

  const [dataFiles, setDataFile] = useState<TFileTypeField[]>();

  const { data, loading, error } = useQuery(GET_DATASTORE_ITEM_DETAILS, {
    variables: {
      datastoreId: router.query.datastore_id || "",
      projectId: router.query.application_id || "",
      itemId: itemTableSelected?.i_id || "",
    },
  });

  useEffect(() => {
    if (!loading && data && !error) {
      setDataFile(
        data.getDatastoreItemDetails?.field_values.filter(
          (item: { dataType: string }) => item.dataType === "file"
        )
      );
    }
  }, [loading, data, error]);

  const convertdataChipRes = (chip: string) => {
    return (
      <Stack sx={{ maxWidth: "250px", ml: 2.5 }} direction="row" spacing={1}>
        <Box sx={{ textTransform: "capitalize" }}>
          {chip &&
            chip
              .split(",")
              .map((chip, index) => (
                <Chip sx={{ m: 0.5 }} key={index} label={chip} />
              ))}
        </Box>
      </Stack>
    );
  };

  const convertDataFile = useCallback(
    (id: string) => {
      if (dataFiles && id) {
        const ids = id?.split(",");

        const dataFileArr: { name?: string; link?: string }[] = [];

        dataFiles.map((item) => {
          if (item.value?.length > 0 && ids?.length > 0) {
            ids.map((id) => {
              if (item.value[0].file_id === id) {
                dataFileArr.push({
                  name: item.value[0].filename,
                  link:
                    item.value[0].selfLink ||
                    item.value[0].mediaLink?.replace("/storage/", "") ||
                    "",
                });
              }
            });
          }
        });
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              ml: 3,
              maxWidth: "250px",
            }}
          >
            <AttachmentIcon fontSize="small" />
            {dataFileArr.map((file, index) => (
              <Link
                key={index}
                sx={{
                  ml: 1,
                }}
                color="#07ccb2"
                href={`https://storage.googleapis.com/${file.link}`}
                variant="body2"
              >
                {file.name}
              </Link>
            ))}
          </Box>
        );
      }
    },
    [dataFiles]
  );

  return (
    <MuiDrawer
      variant="persistent"
      open={open}
      anchor="right"
      sx={{
        "& .MuiDrawer-paper": {
          top: 0,
          position: "relative",
          minWidth: 300,
          boxSizing: "border-box",
          backgroundColor: "background.boxModal",
          borderTop: "1px solid",
          borderColor: darkMode ? "transparent" : "#bdc3c7",
          pb: 5,
          height: "87vh",
          "&::-webkit-scrollbar": {
            width: "0px",
            height: "0px",
          },
        },
      }}
    >
      <Box sx={{ textAlign: "right" }}>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-haspopup="true"
          onClick={() => {
            setOpen(false);
            setItemTableSelected({});
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {dataColumn &&
        itemTableSelected &&
        Object.keys(dataColumn).map((key) => (
          <Box key={key} sx={{ fontSize: "14px", mb:3  }}>
            <Box sx={{ padding: "0 17px 10px", display: "flex"}}>
              <Typography sx={{ maxWidth: "250px", mr: 1, fontWeight: "bold", fontSize: "14px", color: darkMode ? "#fff" : "inherit", }}>
                {dataColumn[key].name}
              </Typography>
              {dataColumn[key].dataType !== "separator" &&
                dataColumn[key].dataType !== "label" && (
                  <Typography sx={{ maxWidth: "250px", color: "#ACACAE", fontSize: "13px" }}>
                    {dataColumn[key].dataType}
                  </Typography>
                )}
            </Box>
            <Box>
              {dataColumn[key].dataType === "select" ||
              dataColumn[key].dataType === "radio" ||
              dataColumn[key].dataType === "checkbox" ||
              dataColumn[key].dataType === "users" ? (
                convertdataChipRes(itemTableSelected?.[key] as string)
              ) : dataColumn[key].dataType === "file" ? (
                convertDataFile(itemTableSelected?.[key] as string)
              ) : (
                <Typography
                  sx={{
                    maxWidth: "250px",
                    ml: 3,
                    fontSize: "13px",
                    textTransform: "capitalize",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {itemTableSelected?.[key]}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
    </MuiDrawer>
  );
};

export default RecordRight;
