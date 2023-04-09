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
import { useSetRecoilState } from "recoil";

import { WORKSPACES_QUERY } from "../../graphql/workspace";
import { workspacesState } from "../../recoil/atom/workspace";
import { TWorkspaces } from "../../recoil/atom/workspace/types";

const cookie = getCookie("token");

const RootWorkspace: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { push: routerPush } = useRouter();
  const setWorkspaces = useSetRecoilState(workspacesState);

  const { data, loading, error } = useQuery<TWorkspaces>(WORKSPACES_QUERY, {
    variables: { payload: { name: "" } },
  });

  const handleClose = () => {
    routerPush("/dashboard");
  };

  useEffect(() => {
    if (loading)
      setWorkspaces({
        loading: true,
      });
    if (!loading && data && !error) {
      setWorkspaces({
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
  }, [data, loading, error, setWorkspaces, routerPush]);

  useEffect(() => {
    if (!cookie || cookie === "") {
      routerPush("/auth/login");
    }
  }, [routerPush]);

  return (
    <>
      {children}
      <Dialog
        open={!!error && !!cookie && cookie !== ""}
        onClose={() => {}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Error</DialogTitle>
        <DialogContent>
          <Alert severity="error">Workspaces error!</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Back</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RootWorkspace;
