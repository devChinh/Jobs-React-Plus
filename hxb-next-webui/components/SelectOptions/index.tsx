import { useRouter } from "next/router";
import React, { useMemo } from "react";

import { Box, FormControl, MenuItem, Select } from "@mui/material";

import { TDataComon } from "../../recoil/atom/dashboard/types";

interface SelectedCommonProps {
  data: TDataComon[];
  title: string;
  width?: number;
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

const CommonSelectOptions: React.FC<SelectedCommonProps> = ({
  data,
  title,
}) => {
  const router = useRouter();
  const selectedValue = useMemo(() => {
    return router.query.id;
  }, [router.query.id]);

  return (
    <Box>
      <FormControl sx={{ m: 0, minWidth: 120 }}>
        <Select
          value={selectedValue}
          MenuProps={MenuProps}
          inputProps={{ "aria-label": "Without label" }}
          onChange={(e) => {
            router.replace(
              `/${title}/${e.target.value}`,
              `/${title}/${e.target.value}`,
              {
                shallow: true,
              }
            );
          }}
          style={{
            fontSize: "15px",
            fontWeight: "bold",
          }}
          sx={{
            backgroundColor: "unset",
            height: "60px",
            border: "unset",
            borderColor: "unset",
            marginLeft: "-14px",
            ".MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        >
          {data &&
            data.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CommonSelectOptions;
