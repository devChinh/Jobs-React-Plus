import { useMutation } from "@apollo/client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import React from "react";
import { TSubscriptionDetail } from "../../recoil/atom/subscription/types";
import { AccordionCustom } from "./styles";

const drawerWidth: number = 240;
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    height: "100vh",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
  },
}));

interface SubscriptionMenuProps {
  data?: TSubscriptionDetail[];
}

const SubscriptionMenu: React.FC<SubscriptionMenuProps> = ({ data }) => {
  const router = useRouter();

  const isBillingAccountRouter = router.query.billing_account_id;

  return (
    <Drawer
      variant="permanent"
      open={true}
      sx={{
        backgroundColor: "subscription.background.drawer",
      }}
    >
      <List sx={{ pt: "0px" }}>
        <ListItem
          sx={{
            pl: "20px",
            backgroundColor: !isBillingAccountRouter
              ? "subscription.background.default"
              : "inherit",
          }}
          button
        >
          <ListItemText
            onClick={() => {
              router.replace(
                `/subscription/${router.query.id}`,
                `/subscription/${router.query.id}`,
                {
                  shallow: true,
                }
              );
            }}
            primary="Overview"
          />
        </ListItem>
      </List>
      {/* {data && (
        <AccordionCustom
          disableGutters={true}
          square={true}
          sx={{
            m: "0!important",
            pl: 0,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{ pl: "20px" }}
          >
            <Typography
              noWrap
              sx={{
                maxWidth: "170px",
                fontWeight: "bold",
                color: "subscription.text.primary",
              }}
            >
              Billing Accounts
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pl: 0, pr: 0, pt: 0 }}>
            {data &&
              data.map((datastore) => (
                <ListItem
                  key={datastore.billing_account_id}
                  onClick={() => {
                    router.replace(
                      `/subscription/${router.query.id}?billing_account_id=${datastore.billing_account_id}`,
                      `/subscription/${router.query.id}?billing_account_id=${datastore.billing_account_id}`,
                      {
                        shallow: true,
                      }
                    );
                  }}
                  sx={{ p: 0 }}
                  button
                >
                  <ListItemText
                    sx={{ m: 0 }}
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          backgroundColor:
                            isBillingAccountRouter ===
                            datastore.billing_account_id
                              ? "subscription.background.default"
                              : "inherit",
                        }}
                      >
                        <Divider
                          orientation={"vertical"}
                          sx={{
                            mr: "27px",
                            width:
                              isBillingAccountRouter &&
                              isBillingAccountRouter ===
                                datastore.billing_account_id
                                ? "2px"
                                : "0px",
                            border: "unset",
                            height: "24px",
                          }}
                        />

                        <Typography noWrap>
                          {datastore.billing_account_name}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
          </AccordionDetails>
        </AccordionCustom>
      )} */}
    </Drawer>
  );
};

export default SubscriptionMenu;
