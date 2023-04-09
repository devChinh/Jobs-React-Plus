import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { useMutation, useQuery } from "@apollo/client";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  TextField,
  Toolbar,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useSetRecoilState } from "recoil";

import ButtonConfirm from "../buttonConfirm";

import * as styles from "../../container/OrganizationDetail/style";
import { ORG_PLAN_QUERY } from "../../graphql/organization";
import { ADD_SUBSCRIPTION } from "../../graphql/subscription";
import {
  TGetProductsDetailTripe,
  TOrgPlan,
} from "../../recoil/atom/organization/types";
import { TSubscriptionDetail } from "../../recoil/atom/subscription/types";
import { notificationState } from "../../recoil/atom/workspace";

type TPaymentMethod = {
  payment_id: string;
  payment_name: string;
  payment_number: string;
};

interface OrganizationWorkSpacesProps {
  mockPaymentMethod: TPaymentMethod[];
  getSubscription: TSubscriptionDetail[];
}

const WorkspacesComponent: React.FC<OrganizationWorkSpacesProps> = ({
  mockPaymentMethod,
  getSubscription,
}) => {
  const { t } = useTranslation("organization");
  const router = useRouter();

  const { data, error, loading } =
    useQuery<TGetProductsDetailTripe>(ORG_PLAN_QUERY);
  const [addSubscription] = useMutation(ADD_SUBSCRIPTION, {});

  const setNotification = useSetRecoilState(notificationState);

  const [plans, setPlans] = useState<TOrgPlan[]>();
  const [tabItem, setTabItem] = useState("plan");
  const [planSelected, setPlanSelected] = useState<TOrgPlan>();
  const [planNameSelected, setPlanNameSelected] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState(
    mockPaymentMethod[0].payment_number
  );
  const [billingAccount, setBillingAccount] = useState(
    getSubscription[0].billing_account_name
  );
  const [openAddWorkspacePlan, setOpenAddWorkspacePlan] = useState(false);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTabItem(newValue);
  };

  const handleChangeWorkspacePLan = (event: SelectChangeEvent) => {
    setPlanNameSelected(event.target.value);
  };

  const handleChangePaymentMethod = (event: SelectChangeEvent) => {
    setPaymentMethod(event.target.value);
  };

  const handleChangeBillingAccount = (event: SelectChangeEvent) => {
    setBillingAccount(event.target.value);
  };

  const handleSaveWorkspacePlan = async () => {
    setOpenAddWorkspacePlan(false);
    try {
      const { data } = await addSubscription({
        variables: {
          payment: {
            ws_id: router.query.w_id,
            org_id: router.query.id,
            product_id: planSelected?.id,
          },
        },
      });
      if (data) {
        setNotification({
          open: true,
          severity: "success",
          message: "save workspace plan success",
        });
      }
    } catch (err) {
      setNotification({
        open: true,
        severity: "error",
        message: "save workspace plan err",
      });
    }
  };

  useEffect(() => {
    if (data) setPlans(data.getProductsSTripe);
  }, [data]);

  useEffect(() => {
    if (plans && plans.length > 0) {
      setPlanSelected(plans[0]);
      setPlanNameSelected(plans[0].name);
    }
  }, [plans]);

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={tabItem}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              height: "80vh",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChangeTab}
                aria-label="lab API tabs example"
                TabIndicatorProps={{
                  style: {
                    display: "none",
                  },
                }}
              >
                <Tab
                  sx={{
                    textTransform: "none",
                    "&.Mui-selected": {
                      backgroundColor: "organization.background.default",
                      color: "text.primary",
                      border: "none",
                    },
                  }}
                  label={t("plan")}
                  value="plan"
                />
                <Tab
                  sx={{
                    textTransform: "none",
                    "&.Mui-selected": {
                      backgroundColor: "organization.background.default",
                      color: "text.primary",
                    },
                  }}
                  label={t("payment_methods")}
                  value="payment_method"
                />
              </TabList>
            </Box>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  height: "80vh",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <TabPanel value="plan">
                <Toolbar
                  sx={{
                    minHeight: "14px!important",
                    pr: "17px!important",
                    pl: "17px!important",
                  }}
                >
                  <styles.FormLabelCustom
                    sx={{
                      color: "text.primary",
                      minWidth: "200px",
                    }}
                  >
                    {t("workspace_plan")}
                  </styles.FormLabelCustom>
                  <FormControl
                    sx={{
                      ml: 8,
                      color: "text.primary",
                      minWidth: "216px",
                      height: "37px",
                    }}
                  >
                    <Select
                      value={planNameSelected}
                      onChange={handleChangeWorkspacePLan}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      sx={{
                        backgroundColor: "organization.background.default",
                        height: "37px",
                        border: "1px solid #38383B",
                        borderRadius: "5px",
                        ".MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                      MenuProps={{
                        sx: {
                          "&& .css-i9gqri-MuiButtonBase-root-MuiMenuItem-root.Mui-selected":
                            {
                              backgroundColor: "#00c6ab",
                            },
                          "&& .css-1fyk6f1-MuiButtonBase-root-MuiMenuItem-root.Mui-selected":
                            {
                              backgroundColor: "#00c6ab",
                            },
                        },
                      }}
                    >
                      {plans &&
                        plans.map((plan) => (
                          <MenuItem
                            key={plan.id}
                            value={plan.name}
                            onClick={() => setPlanSelected(plan)}
                          >
                            {plan.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Toolbar>
                <Toolbar
                  sx={{
                    minHeight: "14px!important",
                    pr: "17px!important",
                    pl: "17px!important",
                    pt: "17px!important",
                  }}
                >
                  <styles.FormLabelCustom
                    sx={{
                      color: "text.primary",
                      minWidth: "200px",
                    }}
                  >
                    {t("payment_methods")}
                  </styles.FormLabelCustom>
                  <FormControl
                    sx={{
                      ml: 8,
                      color: "text.primary",
                      minWidth: "216px",
                      height: "37px",
                    }}
                  >
                    <Select
                      value={billingAccount}
                      onChange={handleChangeBillingAccount}
                      displayEmpty
                      inputProps={{
                        "aria-label": "Without label",
                      }}
                      sx={{
                        backgroundColor: "organization.background.default",
                        height: "37px",
                        border: "1px solid #38383B",
                        borderRadius: "5px",
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
                      {getSubscription &&
                        getSubscription.map((item) => (
                          <MenuItem
                            key={item.billing_account_id}
                            value={item.billing_account_name}
                          >
                            {item.billing_account_name}
                          </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText
                      sx={{
                        color: "text.primary",
                        fontSize: "14px",
                        textDecorationLine: "underline",
                      }}
                    >
                      {t("manage_billing_account")}
                    </FormHelperText>
                  </FormControl>
                </Toolbar>
                <ButtonConfirm
                  buttonType="save"
                  buttonClick={() => setOpenAddWorkspacePlan(true)}
                />
              </TabPanel>
            )}
            <Dialog
              open={openAddWorkspacePlan}
              onClose={() => setOpenAddWorkspacePlan(false)}
              aria-labelledby="responsive-dialog-title"
              sx={{ p: 5 }}
            >
              <DialogTitle id="responsive-dialog-title">
                Update Workspace Plan
              </DialogTitle>
              <DialogActions sx={{ mb: 2, mr: 2, justifyContent: "center" }}>
                <ButtonConfirm
                  buttonType="cancel"
                  buttonClick={() => setOpenAddWorkspacePlan(false)}
                />
                <ButtonConfirm
                  buttonType="ok"
                  buttonClick={() => handleSaveWorkspacePlan()}
                />
              </DialogActions>
            </Dialog>
            <TabPanel value="payment_method">
              <Toolbar
                sx={{
                  minHeight: "14px!important",
                  pr: "17px!important",
                  pl: "17px!important",
                }}
              >
                <styles.FormLabelCustom
                  sx={{
                    color: "text.primary",
                  }}
                >
                  {t("payment_methods")}
                </styles.FormLabelCustom>
                <FormControl
                  sx={{
                    ml: 7,
                    color: "text.primary",
                    minWidth: "124px",
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
                      borderRadius: "5px",
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
                          value={payment.payment_number}
                        >
                          {payment.payment_number}
                        </MenuItem>
                      ))}
                  </Select>
                  <FormHelperText
                    sx={{
                      color: "text.primary",
                      fontSize: "14px",
                      textDecorationLine: "underline",
                    }}
                  >
                    {t("manage_payment_methods")}
                  </FormHelperText>
                </FormControl>
              </Toolbar>
              <Toolbar
                sx={{
                  mt: "72px",
                }}
              >
                <styles.FormLabelCustom
                  sx={{
                    color: "text.primary",
                  }}
                >
                  {t("address")}
                </styles.FormLabelCustom>
                <TextField
                  size="small"
                  sx={{
                    backgroundColor: "organization.background.default",
                    borderRadius: "10px",
                    ml: 8,
                    ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        border: "1px solid",
                      },
                  }}
                  value="XXXXXXXXX"
                  fullWidth
                />
              </Toolbar>
              <styles.ToolbarCustom>
                <styles.FormLabelCustom
                  sx={{
                    color: "text.primary",
                  }}
                >
                  {t("name")}
                </styles.FormLabelCustom>
                <TextField
                  size="small"
                  sx={{
                    backgroundColor: "organization.background.default",
                    borderRadius: "10px",
                    ml: 8,
                    ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        border: "1px solid",
                      },
                  }}
                  value="XXXXXXXXX"
                  fullWidth
                />
              </styles.ToolbarCustom>
              <styles.ToolbarCustom>
                <styles.FormLabelCustom
                  sx={{
                    color: "text.primary",
                  }}
                >
                  {t("tel")}
                </styles.FormLabelCustom>
                <TextField
                  size="small"
                  sx={{
                    backgroundColor: "organization.background.default",
                    borderRadius: "10px",
                    ml: 8,
                    ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        border: "1px solid",
                      },
                  }}
                  value="XXXXXXXXX"
                  fullWidth
                />
              </styles.ToolbarCustom>
              <styles.ToolbarCustom>
                <styles.FormLabelCustom
                  sx={{
                    color: "text.primary",
                  }}
                >
                  {t("email")}
                </styles.FormLabelCustom>
                <TextField
                  size="small"
                  sx={{
                    backgroundColor: "organization.background.default",
                    borderRadius: "10px",
                    ml: 8,
                    ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        border: "1px solid",
                      },
                  }}
                  value="XXXXXXXXX"
                  fullWidth
                />
              </styles.ToolbarCustom>
              <ButtonConfirm buttonType="save" />
            </TabPanel>
          </>
        )}
      </TabContext>
    </Box>
  );
};

export default WorkspacesComponent;
