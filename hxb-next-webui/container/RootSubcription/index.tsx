import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import { subscriptionsState } from "../../recoil/atom/subscription";
import {
  TSubscription,
  TSubscriptionInfo,
  TSubscriptions,
} from "../../recoil/atom/subscription/types";

const cookie = getCookie("token");

const RootSubscription: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { push: routerPush } = useRouter();
  const setSubscriptions = useSetRecoilState(subscriptionsState);

  //   const { data, loading, error } =
  //     useQuery<TSubscriptions>(SUBSCRIPTIONS_QUERY);

  // useEffect(() => {
  //     if (loading)
  //     setSubscriptions({
  //       loading: true,
  //     });
  //     if (!loading && data && !error) {
  //       setSubscriptions({
  //         ...data,
  //         fetched: true,
  //       });
  //     }
  //   }, [data, loading, error, setSubscriptions]);

  const subscriptions: TSubscription[] = [
    {
      subscription_id: "1",
      organization_icon: null,
      organization_name: "Organization A",
      organization_description: "Description of this Organization",
      workspaces: "111",
      billing_accounts: "111",
    },
    {
      subscription_id: "2",
      organization_icon: null,
      organization_name: "Organization B",
      organization_description: "Description of this Organization",
      workspaces: "222",
      billing_accounts: "222",
    },
    {
      subscription_id: "3",
      organization_icon: null,
      organization_name: "Organization C",
      organization_description: "Description of this Organization",
      workspaces: "333",
      billing_accounts: "333",
    },
    {
      subscription_id: "4",
      organization_icon: null,
      organization_name: "Organization D",
      organization_description: "Description of this Organization",
      workspaces: "444",
      billing_accounts: "444",
    },
    {
      subscription_id: "5",
      organization_icon: null,
      organization_name: "Organization E",
      organization_description: "Description of this Organization",
      workspaces: "555",
      billing_accounts: "555",
    },
    {
      subscription_id: "6",
      organization_icon: null,
      organization_name: "Organization F",
      organization_description: "Description of this Organization",
      workspaces: "666",
      billing_accounts: "666",
    },
    {
      subscription_id: "7",
      organization_icon: null,
      organization_name: "Organization G",
      organization_description: "Description of this Organization",
      workspaces: "777",
      billing_accounts: "777",
    },
    {
      subscription_id: "8",
      organization_icon: null,
      organization_name: "Organization H",
      organization_description: "Description of this Organization",
      workspaces: "888",
      billing_accounts: "888",
    },
    {
      subscription_id: "9",
      organization_icon: null,
      organization_name: "Organization K",
      organization_description: "Description of this Organization",
      workspaces: "999",
      billing_accounts: "999",
    },
  ];

  const subscriptionInfo: TSubscriptionInfo = {
    subscriptions: subscriptions,
    current_subscription_id: "1",
  };

  const data = {
    subscriptions: subscriptionInfo,
    fetched: true,
  };

  useEffect(() => {
    setSubscriptions({
      ...data,
      fetched: true,
    });
  }, []);

  useEffect(() => {
    if (!cookie || cookie === "") {
      routerPush("/auth/login");
    }
  }, [routerPush]);

  return (
    <>
      {children}
      {/* <Dialog
        open={!!error && !!cookie && cookie !== ""}
        onClose={() => {}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Error</DialogTitle>
        <DialogContent>
          <Alert severity="error">Subscription error!</Alert>
        </DialogContent>
      </Dialog> */}
    </>
  );
};

export default RootSubscription;
