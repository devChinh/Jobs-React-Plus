import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { useQuery } from "@apollo/client";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { getCookie } from "cookies-next";
import { useTranslation } from "next-i18next";
import { useSetRecoilState } from "recoil";

import { ORGANIZATIONS_QUERY } from "../../graphql/organization";
import { organizationsState } from "../../recoil/atom/organization";
import { TOrganizations } from "../../recoil/atom/organization/types";

const cookie = getCookie("token");

const RootOrganization: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { t } = useTranslation("organization");
  const { push: routerPush } = useRouter();
  const setOrganizations = useSetRecoilState(organizationsState);
  const [open, setOpen] = React.useState(true);

  const { data, loading, error } =
    useQuery<TOrganizations>(ORGANIZATIONS_QUERY);

  const handleClose = () => {
    setOpen(false);
    routerPush("/dashboard");
  };

  useEffect(() => {
    if (!loading && data && !error) {
      setOrganizations({
        ...data,
        fetched: true,
      });
    }
    if (error) {
      const err = { error };
      if (
        err.error.graphQLErrors.find((err) => err.message == "TOKEN_INVALID")
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
  }, [data, loading, error, setOrganizations, routerPush]);

  useEffect(() => {
    if (!cookie || cookie === "") {
      routerPush("/auth/login");
    }
  }, [routerPush]);

  return (
    <>
      {children}
      <Dialog
        // open={!!error && !!cookie && cookie !== ""}
        open={false}
        onClose={() => {}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t("error")}</DialogTitle>
        <DialogContent>
          <Alert severity="error">{t("organization_error")}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("back")}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RootOrganization;
