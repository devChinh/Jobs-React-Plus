import React, { useContext } from "react";

import { TextareaAutosize } from "@mui/material";

import ColorModeContext from "../../modules/styles/ColorModeContext";

interface TextAriaCommonProps {
  data?: string;
  setPayloadApi?: React.Dispatch<React.SetStateAction<string>>;
  borderColor?: string;
}

const CommonTextAria: React.FC<TextAriaCommonProps> = ({
  data,
  setPayloadApi,
  borderColor,
}) => {
  const { darkMode } = useContext(ColorModeContext);

  const handleChangeTextAriaValue = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    if (setPayloadApi) setPayloadApi(e.target.value);
  };

  return (
    <TextareaAutosize
      aria-label="minimum height"
      minRows={3}
      value={data}
      onChange={handleChangeTextAriaValue}
      style={{
        marginTop: 1,
        width: "100%",
        borderRadius: "5px",
        border: "1px solid",
        borderColor: borderColor,
        backgroundColor: darkMode ? "#454545" : "#c4c4c491",
        color: darkMode ? "#ffffff" : "#252733",
        fontSize: "14px",
      }}
    />
  );
};

export default CommonTextAria;
