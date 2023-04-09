import React, { useEffect, useState } from "react";

import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";

import { PaymentMethod } from "../../../container/OrganizationDetail";
import { TSubscriptionDetail } from "../../../recoil/atom/subscription/types";
import ButtonConfirm from "../../buttonConfirm";
import * as styles from "./style";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  textFormLabel1?: string;
  textFormLabel2?: string;
  textFormLabel3?: string;
  getSubscription?: TSubscriptionDetail;
  mockPaymentMethod?: PaymentMethod[];
}

const ModalBillingAccount: React.FC<Props> = ({
  open,
  setOpen,
  title,
  textFormLabel1,
  textFormLabel2,
  textFormLabel3,
  getSubscription,
  mockPaymentMethod,
}) => {
  const { t } = useTranslation("common");

  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    if (mockPaymentMethod && mockPaymentMethod.length > 0)
      setPaymentMethod(mockPaymentMethod[0].payment_name);
  }, [mockPaymentMethod]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePaymentMethod = (event: SelectChangeEvent) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
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
          <styles.ToolbarCustom>
            <FormLabel
              sx={{
                color: "text.primary",
                minWidth: "180px",
              }}
            >
              {textFormLabel1}
            </FormLabel>
            <TextField
              sx={{
                backgroundColor: "organization.background.default",
                borderRadius: "10px",
                ml: 8,
              }}
              defaultValue={
                getSubscription ? getSubscription.billing_account_name : ""
              }
              fullWidth
              size={"small"}
            />
          </styles.ToolbarCustom>
          <styles.ToolbarCustom>
            <FormLabel
              sx={{
                color: "text.primary",
                minWidth: "180px",
              }}
            >
              {textFormLabel2}
            </FormLabel>
            <TextField
              sx={{
                backgroundColor: "organization.background.default",
                borderRadius: "10px",
                ml: 8,
              }}
              defaultValue={""}
              fullWidth
              size={"small"}
            />
          </styles.ToolbarCustom>
          <styles.ToolbarCustom>
            <FormLabel
              sx={{
                color: "text.primary",
                minWidth: "180px",
              }}
            >
              {textFormLabel3}
            </FormLabel>
            <FormControl
              sx={{
                ml: 8,
                color: "text.primary",
                minWidth: "50px",
                height: "37px",
              }}
            >
              <Select
                value={paymentMethod}
                onChange={handleChangePaymentMethod}
                displayEmpty
                inputProps={{
                  "aria-label": "Without label",
                }}
                sx={{
                  backgroundColor: "organization.background.default",
                  height: "37px",
                  border: "1px solid #38383B",
                  borderRadius: "10px",
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
                MenuProps={{
                  sx: {
                    "&& .Mui-selected": {
                      backgroundColor: "#00c6ab",
                    },
                  },
                }}
              >
                {mockPaymentMethod &&
                  mockPaymentMethod.map((payment) => (
                    <MenuItem
                      key={payment.payment_id}
                      value={payment.payment_name}
                    >
                      {payment.payment_name}
                    </MenuItem>
                  ))}
              </Select>
              <FormHelperText
                sx={{
                  color: "text.primary",
                  fontSize: "14px",
                  minWidth: "50px",
                  textDecorationLine: "underline",
                }}
              >
                {t("manage_payment_methods")}
              </FormHelperText>
            </FormControl>
          </styles.ToolbarCustom>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              paddingRight: "30px",
            }}
          >
            <ButtonConfirm
              buttonType="cancel"
              buttonClick={() => setOpen(false)}
            />
            <ButtonConfirm buttonType="ok" buttonClick={() => setOpen(false)} />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ModalBillingAccount;
