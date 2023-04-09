import React from "react";

import { Button } from "@mui/material";
import { useTranslation } from "next-i18next";

import { TButton, TButtonType } from "../../recoil/atom/common/types";

interface Props {
  buttonType: TButton;
  type?: TButtonType;
  buttonClick?: () => void;
}

const ButtonConfirm: React.FC<Props> = ({ buttonType, buttonClick, type }) => {
  const { t } = useTranslation("common");

  const handleClick = () => {
    buttonClick && buttonClick();
  };

  return (
    <Button
      sx={{
        color: "text.primary",
        ml: "15px",
        // mt: "27px",
        fontSize: "14px",
        borderColor:
          buttonType === "cancel"
            ? "#acacae"
            : buttonType === "delete"
            ? "#FF7979"
            : "#0accb2",
        backgroundColor:
          buttonType === "cancel"
            ? "#acacae"
            : buttonType === "delete"
            ? "#FF7979"
            : "#0accb2",
        textTransform: "none",
        whiteSpace: "nowrap",
        minWidth: "72px",
        height: "31px",
        borderRadius: "5px",
      }}
      variant="outlined"
      disableRipple
      type={type}
      onClick={handleClick}
    >
      {buttonType === "cancel"
        ? t("cancel")
        : buttonType === "save"
        ? t("save")
        : buttonType === "delete"
        ? t("delete")
        : buttonType === "edit"
        ? t("edit")
        : t("ok")}
    </Button>
  );
};

export default ButtonConfirm;
