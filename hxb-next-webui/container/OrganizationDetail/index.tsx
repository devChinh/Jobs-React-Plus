import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

import { useLazyQuery, useMutation } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tab,
  Typography,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { useSetRecoilState } from "recoil";

import ModalAdd from "../../components/modal/modalAdd";
import ModalBillingAccount from "../../components/modal/modalBillingAcc";
import OrganizationUsersComponent from "../../components/organization/organizationUsers";
import PaymentMethodsComponent from "../../components/organization/paymentMethods";
import SettingComponent from "../../components/organization/setting";
import WorkspacesComponent from "../../components/organization/workspaces";
import DashboardDetail from "../../container/DashboardDetail";
import {
  ADD_WORKSPACE_TO_ORG,
  CARD_IN_ORG_QUERY,
  ORGANIZATION_QUERY,
  USER_IN_ORG_QUERY,
  WORKSPACE_CAN_ADD_ORG_QUERY,
  WORKSPACE_IN_ORG_QUERY,
} from "../../graphql/organization";
import {
  TCardInOrg,
  TGetCardInOrg,
  TGetOrganization,
  TGetUserInOrg,
  TOrganization,
  TUserInOrg,
  TWorkspace,
  TWorkspaceInOrg,
  TWorkspacesCanAddOrg,
} from "../../recoil/atom/organization/types";
import { notificationState } from "../../recoil/atom/workspace";
import * as styles from "./style";

const drawerWidth: number = 240;
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
  },
}));

export type PaymentMethod = {
  payment_id: string;
  payment_name: string;
  payment_number: string;
};
type TSubscriptionDetail = {
  billing_account_id: string;
  billing_account_name: string;
};

const mockPaymentMethod: PaymentMethod[] = [
  {
    payment_id: "1",
    payment_name: "Card A",
    payment_number: "****4242",
  },
  {
    payment_id: "2",
    payment_name: "Card B",
    payment_number: "****1234",
  },
  {
    payment_id: "3",
    payment_name: "Card C",
    payment_number: "****5678",
  },
  {
    payment_id: "4",
    payment_name: "Invoice Payment",
    payment_number: "Invoice Payment",
  },
];
const getSubscription: TSubscriptionDetail[] = [
  {
    billing_account_id: "1",
    billing_account_name: "Billing Account 1",
  },
  {
    billing_account_id: "2",
    billing_account_name: "Billing Account 2",
  },
  {
    billing_account_id: "3",
    billing_account_name: "Billing Account 3",
  },
];

const OrganizationDetailContainer: React.FC<{}> = () => {
  const { t } = useTranslation("organization");
  const router = useRouter();
  const { push: routerPush } = useRouter();

  const [addWorkspaceToOrg] = useMutation(ADD_WORKSPACE_TO_ORG, {});

  const setNotification = useSetRecoilState(notificationState);

  const [openAddWorkspace, setOpenAddWorkspace] = useState(false);
  const [tabWorkSpace, setTabWorkSpace] = useState("");
  const [workspaceCollapse, setWorkspaceCollapse] = useState(true);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [workspaceInOrg, setWorkspaceInOrg] = useState<TWorkspace[]>();
  const [workspacesCanAddOrg, setWorkspacesCanAddOrg] =
    useState<TWorkspace[]>();
  const [organization, setOrganization] = useState<TOrganization>();
  const [userInOrg, setUserInOrg] = useState<TUserInOrg[]>([]);
  const [cardInOrg, setCardInOrg] = useState<TCardInOrg[]>([]);
  const isBillingAccountRouter = router.query.billing_account_id;
  const [open, setOpen] = useState<boolean | undefined>(false);
  const [openModalBilling, setOpenModalBilling] = useState<boolean>(false);
  const [openAddWorkspacePlan, setOpenAddWorkspacePlan] = useState(false);

  const isWorkspaceIdRouter = router.query.w_id;

  const [getDataOrganization] = useLazyQuery<TGetOrganization>(
    ORGANIZATION_QUERY,
    {
      fetchPolicy: "network-only",
      onError(err) {
        if (err) {
          if (
            err.graphQLErrors.find(
              (errDetail) => errDetail.message == "TOKEN_INVALID"
            )
          ) {
            routerPush("/auth/login");
            document.cookie.split(";").forEach(function (c) {
              document.cookie = c
                .replace(/^ +/, "")
                .replace(
                  /=.*/,
                  "=;expires=" + new Date().toUTCString() + ";path=/"
                );
            });
          }
        }
      },
    }
  );

  const [getDataWorkspaceCanAddOrg] = useLazyQuery<TWorkspacesCanAddOrg>(
    WORKSPACE_CAN_ADD_ORG_QUERY,
    {
      fetchPolicy: "network-only",
      onError(err) {
        if (err) {
          if (
            err.graphQLErrors.find(
              (errDetail) => errDetail.message == "TOKEN_INVALID"
            )
          ) {
            routerPush("/auth/login");
            document.cookie.split(";").forEach(function (c) {
              document.cookie = c
                .replace(/^ +/, "")
                .replace(
                  /=.*/,
                  "=;expires=" + new Date().toUTCString() + ";path=/"
                );
            });
          }
        }
      },
    }
  );
  const [getDataWorkspaceInOrg] = useLazyQuery<TWorkspaceInOrg>(
    WORKSPACE_IN_ORG_QUERY,
    {
      fetchPolicy: "network-only",
      onError(err) {
        if (err) {
          if (
            err.graphQLErrors.find(
              (errDetail) => errDetail.message == "TOKEN_INVALID"
            )
          ) {
            routerPush("/auth/login");
            document.cookie.split(";").forEach(function (c) {
              document.cookie = c
                .replace(/^ +/, "")
                .replace(
                  /=.*/,
                  "=;expires=" + new Date().toUTCString() + ";path=/"
                );
            });
          }
        }
      },
    }
  );

  const [getDataCardInOrg] = useLazyQuery<TGetCardInOrg>(CARD_IN_ORG_QUERY, {
    fetchPolicy: "network-only",
    onError(err) {
      if (err) {
        if (
          err.graphQLErrors.find(
            (errDetail) => errDetail.message == "TOKEN_INVALID"
          )
        ) {
          routerPush("/auth/login");
          document.cookie.split(";").forEach(function (c) {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(
                /=.*/,
                "=;expires=" + new Date().toUTCString() + ";path=/"
              );
          });
        }
      }
    },
  });

  const [getDataUserInOrg] = useLazyQuery<TGetUserInOrg>(USER_IN_ORG_QUERY, {
    fetchPolicy: "network-only",
    onError(err) {
      if (err) {
        if (
          err.graphQLErrors.find(
            (errDetail) => errDetail.message == "TOKEN_INVALID"
          )
        ) {
          routerPush("/auth/login");
          document.cookie.split(";").forEach(function (c) {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(
                /=.*/,
                "=;expires=" + new Date().toUTCString() + ";path=/"
              );
          });
        }
      }
    },
  });

  const getOrganization = useCallback(async () => {
    try {
      const { data } = await getDataOrganization({
        variables: {
          getOrganizationId: router.query.id,
        },
      });

      setOrganization(data?.getOrganization);
    } catch (err) {
      console.log("err", err);
    }
  }, [getDataOrganization, router.query.id]);

  const getWorkspacesCanAddOrg = useCallback(async () => {
    try {
      const { data } = await getDataWorkspaceCanAddOrg({
        variables: {
          organizationId: router.query.id,
        },
      });

      setWorkspacesCanAddOrg(data?.getWorkspacesCanAddOrganization);
    } catch (err) {
      console.log("err", err);
    }
  }, [getDataWorkspaceCanAddOrg, router.query.id]);

  const getWorkspacesInOrg = useCallback(async () => {
    try {
      const { data } = await getDataWorkspaceInOrg({
        variables: {
          getWorkspacesInOrganizationId: router.query.id,
        },
      });

      setWorkspaceInOrg(data?.getWorkspacesInOrganization);
    } catch (err) {
      setWorkspaceInOrg(undefined);
    }
  }, [getDataWorkspaceInOrg, router.query.id]);

  const getCardInOrg = useCallback(async () => {
    try {
      const { data } = await getDataCardInOrg({
        variables: {
          organizationId: router.query.id,
        },
      });

      if (data?.getCardInOrganization) setCardInOrg(data.getCardInOrganization);
    } catch (err) {
      setCardInOrg([]);
    }
  }, [getDataCardInOrg, router.query.id]);

  const getUserInOrg = useCallback(async () => {
    try {
      const { data } = await getDataUserInOrg({
        variables: {
          getUserInOrganizationId: router.query.id,
        },
      });

      if (data?.getUserInOrganization) setUserInOrg(data.getUserInOrganization);
    } catch (err) {
      setUserInOrg([]);
    }
  }, [getDataUserInOrg, router.query.id]);

  useEffect(() => {
    getOrganization();
  }, [getOrganization, router.query.id]);

  useEffect(() => {
    getWorkspacesCanAddOrg();
  }, [getWorkspacesCanAddOrg, router.query.id]);

  useEffect(() => {
    getWorkspacesInOrg();
  }, [getWorkspacesInOrg, router.query.id]);

  useEffect(() => {
    getCardInOrg();
  }, [getCardInOrg, router.query.id]);

  useEffect(() => {
    getUserInOrg();
  }, [getUserInOrg, router.query.id]);

  const onDataAddCard = (item: TCardInOrg) => {
    setCardInOrg((prev) => [...prev, item]);
  };
  const onDataEditCard = (item: TCardInOrg) => {
    const fillArr: TCardInOrg[] = cardInOrg.filter((i) => i.ID !== item.ID);
    setCardInOrg([...fillArr, item]);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabWorkSpace(newValue);
  };

  const handleAddWorkspaceToOrg = async () => {
    try {
      const { data } = await addWorkspaceToOrg({
        variables: {
          addWorkspaceToOrganizationId: router.query.id,
          wid: selectedWorkspaceId,
        },
      });
      if (data) {
        getWorkspacesInOrg();
        getWorkspacesCanAddOrg();
        setNotification({
          open: true,
          severity: "success",
          message: "Add workspace to organization success",
        });
      }
    } catch (err) {
      setNotification({
        open: true,
        severity: "error",
        message: "Add workspace to organization err",
      });
    }
    setOpenAddWorkspace(false);
  };

  return (
    <DashboardDetail>
      <Box
        sx={{
          width: "90%",
          height: "calc(100vh - 61px)",
          display: "flex",
        }}
      >
        <TabContext value={tabWorkSpace}>
          <Drawer variant="permanent" open={true}>
            {/* <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                overflowY: "auto",
                maxHeight: "50%",
                "&::-webkit-scrollbar": {
                  width: "0px",
                  height: "0px",
                },
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  sx={{
                    pl: "12px",
                    pr: "12px",
                    color: "text.listSubheader",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{t("workspaces")}</span>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <AddIcon
                        onClick={() => setOpenAddWorkspace(true)}
                        sx={{ width: "22px", height: "22px" }}
                      />
                      {workspaceCollapse ? (
                        <KeyboardArrowDownIcon
                          onClick={() =>
                            setWorkspaceCollapse(!workspaceCollapse)
                          }
                          sx={{ width: "25px", height: "22px" }}
                        />
                      ) : (
                        <KeyboardArrowDownIcon
                          onClick={() =>
                            setWorkspaceCollapse(!workspaceCollapse)
                          }
                          sx={{
                            transform: "rotate(180deg)",
                            width: "25px",
                            height: "22px",
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </ListSubheader>
              }
            >
              <Collapse
                in={workspaceCollapse}
                sx={{ pl: "20px", pr: "20px" }}
                timeout="auto"
                unmountOnExit
              >
                {typeof data === "undefined" ||
                typeof workspaceInOrg === "undefined" ||
                workspaceInOrg.length === 0 ? (
                  <Typography
                    sx={{
                      color: "text.listSubheader",
                    }}
                    noWrap
                  >
                    {t("no_workspace")}
                  </Typography>
                ) : (
                  <>
                    {workspaceInOrg.map(
                      (datastore: TWorkspace) => (
                        <ListItem
                          key={datastore.w_id}
                          onClick={() => {
                            setTabWorkSpace("");
                            router.replace(
                              `/organization/${router.query.id}?w_id=${datastore.w_id}`,
                              `/organization/${router.query.id}?w_id=${datastore.w_id}`,
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
                                    isWorkspaceIdRouter === datastore.w_id
                                      ? "organization.background.default"
                                      : "inherit",
                                }}
                              >
                                <Divider
                                  orientation={"vertical"}
                                  sx={{
                                    mr: "27px",
                                    width:
                                      isWorkspaceIdRouter &&
                                      isWorkspaceIdRouter === datastore.w_id
                                        ? "2px"
                                        : "0px",
                                    border: "unset",
                                    height: "24px",
                                  }}
                                />

                                <Typography noWrap>{datastore.name}</Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      )
                    )}
                  </>
                )}
              </Collapse>
            </List> */}
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                backgroundColor: "background.paper",
                maxHeight: "30vh",
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              <styles.AccordionCustom
                defaultExpanded={true}
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
                  sx={{
                    pl: "12px",
                    pr: "12px",
                    color: "text.listSubheader",
                    "& .css-1betqn-MuiAccordionSummary-content": {
                      justifyContent: "space-between",
                    },
                  }}
                >
                  <span>{t("workspaces")}</span>
                  <AddIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenAddWorkspace(true);
                    }}
                    sx={{
                      width: "22px",
                      height: "22px",
                      ".MuiAccordionSummary-root": {
                        pointerEvents: "none",
                      },
                    }}
                  />
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    pl: 0,
                    pr: 0,
                    pt: 0,
                    overflowY: "auto",
                    maxHeight: "25vh",
                    "&::-webkit-scrollbar": {
                      width: "0px",
                      height: "0px",
                    },
                  }}
                >
                  {typeof workspaceInOrg === "undefined" ||
                  workspaceInOrg.length === 0 ? (
                    <Typography
                      sx={{
                        color: "text.listSubheader",
                        ml: 3,
                      }}
                      noWrap
                    >
                      {t("no_workspace")}
                    </Typography>
                  ) : (
                    <>
                      {workspaceInOrg.map((datastore: TWorkspace) => (
                        <ListItem
                          key={datastore.w_id}
                          onClick={() => {
                            setTabWorkSpace("");
                            router.replace(
                              `/organization/${router.query.id}?w_id=${datastore.w_id}`,
                              `/organization/${router.query.id}?w_id=${datastore.w_id}`,
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
                                    isWorkspaceIdRouter === datastore.w_id
                                      ? "organization.background.default"
                                      : "inherit",
                                }}
                              >
                                <Divider
                                  orientation={"vertical"}
                                  sx={{
                                    mr: "27px",
                                    width:
                                      isWorkspaceIdRouter &&
                                      isWorkspaceIdRouter === datastore.w_id
                                        ? "2px"
                                        : "0px",
                                    border: "unset",
                                    height: "24px",
                                  }}
                                />

                                <Typography noWrap>{datastore.name}</Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </>
                  )}
                </AccordionDetails>
              </styles.AccordionCustom>
            </List>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                backgroundColor: "background.paper",
                maxHeight: "30vh",
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              <styles.AccordionCustom
                defaultExpanded={true}
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
                  sx={{
                    pl: "12px",
                    pr: "12px",
                    color: "text.listSubheader",
                    "& .css-1betqn-MuiAccordionSummary-content": {
                      justifyContent: "space-between",
                    },
                  }}
                >
                  <span>{t("billing_account")}</span>
                  <AddIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenModalBilling(true);
                    }}
                    sx={{ width: "22px", height: "22px" }}
                  />
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    pl: 0,
                    pr: 0,
                    pt: 0,
                    overflowY: "auto",
                    maxHeight: "25vh",
                    "&::-webkit-scrollbar": {
                      width: "0px",
                      height: "0px",
                    },
                  }}
                >
                  {typeof getSubscription === "undefined" ||
                  getSubscription.length === 0 ? (
                    <Typography
                      sx={{
                        color: "text.listSubheader",
                        ml: 3,
                      }}
                      noWrap
                    >
                      {t("no_billing_account")}
                    </Typography>
                  ) : (
                    <>
                      {getSubscription &&
                        getSubscription.map((datastore) => (
                          <ListItem
                            key={datastore.billing_account_id}
                            // onClick={() => {
                            // 	router.replace(
                            // 		`/subscription/${router.query.id}?billing_account_id=${datastore.billing_account_id}`,
                            // 		`/subscription/${router.query.id}?billing_account_id=${datastore.billing_account_id}`,
                            // 		{
                            // 			shallow: true,
                            // 		}
                            // 	);
                            // }}
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
                    </>
                  )}
                </AccordionDetails>
              </styles.AccordionCustom>
            </List>
            <TabList
              orientation="vertical"
              variant="scrollable"
              value={tabWorkSpace}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{
                ".MuiTabs-indicator": {
                  backgroundColor: "organization.background.default",
                },
              }}
            >
              <Tab
                sx={{
                  textTransform: "none",
                  color: "organization.text.primary",
                  alignItems: "start",
                  border: "unset",
                  "&.Mui-selected": {
                    backgroundColor: "organization.background.default",
                    color: "text.primary",
                  },
                  mt: "25px",
                }}
                label={t("payment_methods")}
                value="payment_methods"
                onClick={() => {
                  router.replace(
                    `/organization/${router.query.id}`,
                    `/organization/${router.query.id}`,
                    {
                      shallow: true,
                    }
                  );
                }}
              />
              <Tab
                sx={{
                  textTransform: "none",
                  color: "organization.text.primary",
                  alignItems: "start",
                  "&.Mui-selected": {
                    backgroundColor: "organization.background.default",
                    color: "text.primary",
                  },
                }}
                label={t("organization_users")}
                value="organization_users"
                onClick={() => {
                  router.replace(
                    `/organization/${router.query.id}`,
                    `/organization/${router.query.id}`,
                    {
                      shallow: true,
                    }
                  );
                }}
              />
              <Tab
                sx={{
                  textTransform: "none",
                  alignItems: "start",
                  color: "organization.text.primary",
                  "&.Mui-selected": {
                    backgroundColor: "organization.background.default",
                    color: "text.primary",
                  },
                }}
                label={t("setting")}
                value="setting"
                onClick={() => {
                  router.replace(
                    `/organization/${router.query.id}`,
                    `/organization/${router.query.id}`,
                    {
                      shallow: true,
                    }
                  );
                }}
              />
            </TabList>
          </Drawer>

          <Box
            sx={{
              maxWidth: "calc(100vw - 310px)",
              width: "100%",
              height: "90vh",
              overflowX: "hidden",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "0px",
                height: "0px",
              },
            }}
          >
            {isWorkspaceIdRouter ? (
              <>
                {workspaceInOrg && workspaceInOrg.length > 0 ? (
                  <WorkspacesComponent
                    mockPaymentMethod={mockPaymentMethod}
                    getSubscription={getSubscription}
                  />
                ) : null}
              </>
            ) : (
              <>
                <TabPanel value="payment_methods">
                  <PaymentMethodsComponent
                    cardInOrg={cardInOrg}
                    getCardInOrg={getCardInOrg}
                    onDataAddCard={onDataAddCard}
                    onDataEditCard={onDataEditCard}
                  />
                </TabPanel>
                <TabPanel value="organization_users">
                  <OrganizationUsersComponent userInOrg={userInOrg} />
                </TabPanel>
                <TabPanel value="setting">
                  <SettingComponent
                    organization={organization}
                    getDataOrganization={getOrganization}
                  />
                </TabPanel>
              </>
            )}
          </Box>
          <ModalBillingAccount
            open={openModalBilling}
            setOpen={setOpenModalBilling}
            title={t("add_billing_account")}
            textFormLabel1={t("billing_account_name")}
            textFormLabel2={t("description")}
            textFormLabel3={t("payment_method")}
            mockPaymentMethod={mockPaymentMethod}
          />
        </TabContext>
      </Box>
      <ModalAdd
        open={openAddWorkspace}
        setOpen={setOpenAddWorkspace}
        data={workspacesCanAddOrg}
        setSelectedWorkspaceId={setSelectedWorkspaceId}
        handleAddWorkspaceToOrg={handleAddWorkspaceToOrg}
      />
    </DashboardDetail>
  );
};

export default OrganizationDetailContainer;
