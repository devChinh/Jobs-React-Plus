import React, { useContext, useMemo, useState } from "react";

import {
  Backdrop,
  Box,
  Button,
  Fade,
  Link,
  Modal,
  Toolbar,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { setCookies } from "cookies-next";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";

import ButtonConfirm from "../../components/buttonConfirm";
import ColorModeContext from "../../modules/styles/ColorModeContext";
import * as styles from "./style";

const columns: GridColDef[] = [
  { field: "nameCookies", headerName: "Name Cookies", width: 130 },
];

const rows = [
  { id: 1, nameCookies: "Snow", key: "Snow", value: "Snow" },
  { id: 2, nameCookies: "Lannister", key: "Lannister", value: "Lannister" },
  { id: 3, nameCookies: "Lannister", key: "Lannister", value: "Lannister" },
  { id: 4, nameCookies: "Stark", key: "Stark", value: "Stark" },
  { id: 5, nameCookies: "Targaryen", key: "Targaryen", value: "Targaryen" },
  { id: 6, nameCookies: "Melisandre", key: "Melisandre", value: "Melisandre" },
  { id: 7, nameCookies: "Clifford", key: "Clifford", value: "Clifford" },
  { id: 8, nameCookies: "Frances", key: "Frances", value: "Frances" },
  { id: 9, nameCookies: "Roxie", key: "Roxie", value: "Roxie" },
];

type TDataCookie = {
  id: number;
  nameCookies: string;
  key: string;
  value: string;
};
const PopupCookiesConsent = () => {
  const showCookieConsentDefault = useMemo(() => {
    if (typeof getCookieConsentValue() === "undefined") return "show";
    return "hidden";
  }, []);
  const [openModalCookies, setOpenModalCookies] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState<"show" | "hidden">(
    showCookieConsentDefault
  );
  const { darkMode } = useContext(ColorModeContext);
  const [selectedRows, setSelectedRows] = React.useState<TDataCookie[]>([]);

  const handleCookies = (acceptCookies: boolean) => {
    if (acceptCookies) {
      setCookies("CookieConsent", true);
      if (selectedRows.length > 0) {
        selectedRows.forEach((row) => {
          setCookies(row.key, row.value);
        });
      }
    } else {
      setCookies("CookieConsent", false);
    }
    setOpenModalCookies(false);
    setShowCookieConsent("hidden");
  };

  const handleAcceptAllCookie = () => {
    setShowCookieConsent("hidden");
    setCookies("CookieConsent", true);
    if (rows.length > 0) {
      rows.forEach((row) => {
        setCookies(row.key, row.value);
      });
    }
  };

  const handleOpenModal = () => {
    setOpenModalCookies(true);
    setShowCookieConsent("hidden");
  };

  return (
    <Box>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModalCookies}
        onClose={() => setOpenModalCookies(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModalCookies}>
          <styles.BoxModal
            sx={{ backgroundColor: darkMode ? "#38383B" : "#f7f7f7" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                overflow: "auto",
              }}
            >
              <Box>
                <Typography
                  sx={{ color: "text.primary" }}
                  variant="h5"
                  gutterBottom
                >
                  Your privacy
                </Typography>
                <Typography sx={{ color: "text.primary" }} gutterBottom>
                  When you visit any web site, it may store or retrieve
                  information on your browser, mostly in the form of cookies.
                  This information might be about you, your preferences or your
                  device and is mostly used to make the site work as you expect
                  it to. The information does not usually directly identify you,
                  but it can give you a more personalised web experience.
                  Because we respect your right to privacy, you can choose not
                  to allow some types of cookies. Click on the different
                  category headings to find out more and change our default
                  settings. However, blocking some types of cookies may affect
                  your experience of the site and the services we are able to
                  offer.
                </Typography>
                <Typography
                  sx={{ color: "text.primary" }}
                  variant="h6"
                  gutterBottom
                >
                  Strictly Necessary Cookies
                </Typography>
                <Typography sx={{ color: "text.primary" }} gutterBottom>
                  These cookies are necessary for the website to function and
                  can not be switched off in our systems. They are usually only
                  set in response to actions you have taken which result in a
                  request for services, such as setting your privacy
                  preferences, logging in or filling in forms. You can set your
                  browser to block or alert you about these cookies, but some
                  parts of the site may not work as a result.
                </Typography>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  hideFooter={true}
                  autoHeight={true}
                  checkboxSelection
                  onSelectionModelChange={(ids) => {
                    const selectedIDs = new Set(ids);
                    const selectedRows = rows.filter((row) =>
                      selectedIDs.has(row.id)
                    );
                    setSelectedRows(selectedRows);
                  }}
                />
              </Box>
              <Toolbar
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "end",
                }}
              >
                <ButtonConfirm
                  buttonType={"cancel"}
                  buttonClick={() => handleCookies(false)}
                />
                <ButtonConfirm
                  buttonType={"save"}
                  buttonClick={() => handleCookies(true)}
                />
              </Toolbar>
            </Box>
          </styles.BoxModal>
        </Fade>
      </Modal>
      <CookieConsent
        location="bottom"
        visible={showCookieConsent}
        style={{ background: "#2B373B" }}
        contentStyle={{ width: "80%" }}
        buttonStyle={{
          display: "none",
        }}
      >
        We use cookies and similar technologies to help personalise content,
        tailor and measure ads, and provide a better experience. By clicking OK
        or turning an option on in Cookie Preferences, you agree to this, as
        outlined in our <Link>Cookie Policy</Link>. To change preferences or
        withdraw consent, please update your Cookie Preferences.
        <Box sx={{ textAlign: "right" }}>
          <Button
            sx={{
              color: "#FFF",
              fontSize: "15px",
              height: "50px",
              borderRadius: "10px",
              width: "100px",
              background: "#0F5C2E",
              mr: 2,
            }}
            onClick={handleAcceptAllCookie}
          >
            OK
          </Button>
          <Button
            sx={{
              color: "#FFF",
              height: "50px",
              borderRadius: "10px",
              background: "#8C5800",
            }}
            onClick={handleOpenModal}
          >
            Cookie Preferences
          </Button>
        </Box>
      </CookieConsent>
    </Box>
  );
};

export default PopupCookiesConsent;
