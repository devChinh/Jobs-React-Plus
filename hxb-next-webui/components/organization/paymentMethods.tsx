import { useRouter } from "next/router";
import React, { useState } from "react";

import { useMutation } from "@apollo/client";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "next-i18next";

import * as styles from "../../container/OrganizationDetail/style";
import {
  ADD_CARD_ORGANIZATION,
  UPDATE_CARD_ORGANIZATION,
} from "../../graphql/organization";
import { TCardInOrg } from "../../recoil/atom/organization/types";
import MenuMoreVert from "../modal/menuMoreVert";
import { validationAddCard } from "./validate";

interface Props {
  cardInOrg: TCardInOrg[];
  getCardInOrg: () => Promise<void>;
  onDataAddCard: (item: TCardInOrg) => void;
  onDataEditCard: (item: TCardInOrg) => void;
}

const PaymentMethodsComponent: React.FC<Props> = ({
  cardInOrg,
  getCardInOrg,
  onDataAddCard,
  onDataEditCard,
}) => {
  const { t } = useTranslation("organization");
  const router = useRouter();

  const [addCardOrganization, { data, loading, error, reset }] = useMutation(
    ADD_CARD_ORGANIZATION,
    {}
  );
  const [updateCardOrganization] = useMutation(UPDATE_CARD_ORGANIZATION, {});
  const [openAddCard, setOpenAddCard] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openMoreIcon = Boolean(anchorEl);
  const idMoreIcon = openMoreIcon ? "simple-popover" : undefined;
  const [inputCardNumber, setInputCardNumber] = useState("");
  const [inputCardCVC, setInputCardCVC] = useState("");
  const [valueDateCard, setValueDateCard] = React.useState<Date | null>(
    new Date()
  );
  const [rowSelected, setRowSelected] = useState<TCardInOrg>();

  const formik = useFormik({
    initialValues: {
      cardNumber: "",
      cvc: "",
    },
    validationSchema: validationAddCard,
    onSubmit: async (values) => {
      if (openMoreIcon === true) {
        const { data } = await updateCardOrganization({
          variables: {
            card: {
              number: values.cardNumber,
              cvc: values.cvc,
              exp_year: String(valueDateCard?.getFullYear()),
              exp_month: String(
                valueDateCard ? valueDateCard?.getMonth() + 1 : 1
              ),
              card_id: String(rowSelected?.ID),
            },
          },
        });
        onDataEditCard(data.updateCardOrganization);
      } else {
        const { data } = await addCardOrganization({
          variables: {
            card: {
              number: values.cardNumber,
              exp_year: String(valueDateCard?.getFullYear()),
              exp_month: String(
                valueDateCard ? valueDateCard?.getMonth() + 1 : 1
              ),
              cvc: values.cvc,
              organization_id: router.query.id,
            },
          },
        });
        onDataAddCard(data.createCardOrganization);
      }
      setOpenAddCard(false);
    },
  });

  const handleAddCard = async () => {
    setOpenAddCard(false);
    try {
      const { data } = await addCardOrganization({
        variables: {
          card: {
            number: inputCardNumber,
            exp_year: String(valueDateCard?.getFullYear()),
            exp_month: String(
              valueDateCard ? valueDateCard?.getMonth() + 1 : 1
            ),
            cvc: inputCardCVC,
            organization_id: router.query.id,
          },
        },
      });
      getCardInOrg();
    } catch (err) {}
  };
  const handleOpenEditCard = () => {
    setValueDateCard(
      new Date(
        Number(rowSelected?.exp_year),
        Number(rowSelected?.exp_month) - 1
      )
    );
    formik.setValues({
      cardNumber: "",
      cvc: String(rowSelected?.cvc),
    });
    setOpenAddCard(true);
  };

  const handleOpenAddCard = () => {
    setOpenAddCard(true);
  };

  const handleCloseAddCard = () => {
    setOpenAddCard(false);
    setInputCardNumber("");
    setInputCardCVC("");
  };

  const handleClickMoreIcon = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMoreIcon = () => {
    setAnchorEl(null);
  };

  return (
    <TableContainer sx={{ width: "100%" }}>
      <Table
        sx={{
          maxWidth: "100%",
          backgroundColor: "background.paper",
          backgroundImage: "unset",
        }}
        aria-labelledby="tableTitle"
        size={"small"}
      >
        <TableHead>
          <TableRow>
            <TableCell align="left" colSpan={6}>
              {t("payment_methods")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cardInOrg &&
            cardInOrg.length > 0 &&
            cardInOrg.map((row, rowIndex) => (
              <styles.TableRowCustom hover tabIndex={-1} key={rowIndex}>
                <TableCell
                  component="th"
                  scope="row"
                  padding="none"
                  sx={{
                    p: 2,
                    wordBreak: "keep-all",
                    backgroundColor: "background.paper",
                    width: "25%",
                  }}
                >
                  {row.name}A
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  padding="none"
                  align="center"
                  sx={{
                    p: 2,
                    wordBreak: "keep-all",
                    backgroundColor: "background.paper",
                  }}
                >
                  Visa
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  padding="none"
                  align="center"
                  sx={{
                    p: 2,
                    wordBreak: "keep-all",
                    backgroundColor: "background.paper",
                  }}
                >
                  ************
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  padding="none"
                  align="center"
                  sx={{
                    p: 2,
                    wordBreak: "keep-all",
                    backgroundColor: "background.paper",
                  }}
                >
                  {row.exp_month}/{row.exp_year}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  padding="none"
                  align="right"
                  sx={{
                    p: 2,
                    wordBreak: "keep-all",
                    backgroundColor: "background.paper",
                    width: "50%",
                  }}
                >
                  <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-haspopup="true"
                    aria-describedby={idMoreIcon}
                    onClick={(e) => {
                      setRowSelected(row);
                      handleClickMoreIcon(e);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </styles.TableRowCustom>
            ))}
        </TableBody>
      </Table>
      <Button
        sx={{
          mt: "24px",
          ml: 2,
          backgroundColor: "organization.background.default",
          border: "1px solid #ACACAE",
          color: "text.primary",
          minWidth: "146px",
          textTransform: "none",
        }}
        variant="outlined"
        disableRipple
        onClick={handleOpenAddCard}
      >
        + {t("add_new_card")}
      </Button>

      <Dialog
        open={openAddCard}
        onClose={handleCloseAddCard}
        aria-labelledby="responsive-dialog-title"
      >
        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <DialogTitle id="responsive-dialog-title">
            {openMoreIcon ? "Update Card" : "Add Card"}
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert
                onClose={() => {
                  reset();
                }}
                severity="error"
              >
                card number or cvc is valid
              </Alert>
            )}
            <Box noValidate component="form" sx={{ width: "90%" }}>
              <TextField
                placeholder="Card number"
                size="small"
                required
                value={formik.values.cardNumber}
                onChange={formik.handleChange}
                error={
                  formik.touched.cardNumber && Boolean(formik.errors.cardNumber)
                }
                helperText={
                  formik.touched.cardNumber && formik.errors.cardNumber
                }
                id="cardNumber"
                name="cardNumber"
                autoComplete="cardNumber"
                sx={{
                  backgroundColor: "organization.background.default",
                  width: "50%",
                  borderRadius: "10px",
                }}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  inputFormat="MM-yyyy"
                  views={["month", "year"]}
                  value={valueDateCard}
                  onChange={setValueDateCard}
                  renderInput={(params: TextFieldProps) => (
                    <TextField
                      size="small"
                      sx={{
                        backgroundColor: "organization.background.default",
                        width: "35%",
                        borderRadius: "10px",
                      }}
                      {...params}
                      helperText={null}
                    />
                  )}
                />
              </LocalizationProvider>

              <TextField
                placeholder="CVC"
                size="small"
                required
                name="cvc"
                type="cvc"
                id="cvc"
                autoComplete="current-cvc"
                value={formik.values.cvc}
                onChange={formik.handleChange}
                error={formik.touched.cvc && Boolean(formik.errors.cvc)}
                helperText={formik.touched.cvc && formik.errors.cvc}
                sx={{
                  backgroundColor: "organization.background.default",
                  width: "15%",
                  borderRadius: "10px",
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ mt: "24px" }}>
            <Button
              sx={{ background: "#ACACAE", color: "text.primary" }}
              autoFocus
              onClick={handleCloseAddCard}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              sx={{ background: "#0accb2", color: "text.primary" }}
              // onClick={handleAddCard}
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <MenuMoreVert
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        textEdit={t("edit")}
        textDelete={t("delete")}
        handleOpenEditCard={handleOpenEditCard}
      />
    </TableContainer>
  );
};

export default PaymentMethodsComponent;
