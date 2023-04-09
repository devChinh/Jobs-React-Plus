import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { useMutation } from "@apollo/client";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRecoilValue } from "recoil";

import DashboardLayout from "../../container/DashboardLayout";
import { ORGANIZATION_ADD_MUTATION } from "../../graphql/organization";
import { organizationsState } from "../../recoil/atom/organization";
import {
  TOrganization,
  TOrganizations,
} from "../../recoil/atom/organization/types";
import { RoleChip, StyledTableCell } from "./style";
import ButtonConfirm from "../../components/buttonConfirm";

const OrganizationContainer: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { t } = useTranslation("organization");

  const o: TOrganizations = useRecoilValue(organizationsState);
  const [addOrg] = useMutation(ORGANIZATION_ADD_MUTATION);

  const { push: routerPush } = useRouter();

  const [organizations, setOrganizations] = useState<TOrganization[]>([]);
  const [displayedOrganizations, setDisplayedOrganizations] = useState<
    TOrganization[]
  >([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [openAddOrg, setOpenAddOrg] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [desInput, setDesInput] = useState("");

  useEffect(() => {
    if (o.fetched) {
      if (o.getOrganizations && o.getOrganizations.length > 0) {
        const orgs: TOrganization[] = [];
        o.getOrganizations.forEach((org) => {
          orgs.push({
            id: org.id,
            name: org.name,
            description: org.description,
            created_at: new Date(org.created_at).toLocaleDateString("jp-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          });
        });
        setOrganizations(orgs);
      }
    }
  }, [o]);

  useEffect(() => {
    const displayed = organizations.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    setDisplayedOrganizations(displayed);
  }, [page, rowsPerPage, organizations]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectOrganization = (organizationId: string) => {
    routerPush({
      pathname: `/organization/${organizationId}`,
    });
  };

  const handleOpenOrganization = (organizationId: string) => {
    const newWindow = window.open(
      `http://dev.hexabase.com/h/${organizationId}`,
      "_blank",
      "noopener,noreferrer"
    );
    if (newWindow) newWindow.opener = null;
  };

  const handleAddOrg = async () => {
    try {
      const { data } = await addOrg({
        variables: {
          org: {
            name: nameInput,
            description: desInput,
          },
        },
      });
    } catch (err) {}
    setOpenAddOrg(false);
  };

  return (
    <DashboardLayout>
      <Typography
        variant="h4"
        component="div"
        sx={{ ml: "24px", mb: "34px", color: "text.titleTable" }}
      >
        {t("organizations")}
      </Typography>
      {displayedOrganizations.length ? (
        <Paper>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size="medium"
              aria-label="a dense table"
            >
              <TableHead sx={{ pt: "24px", width: "100%" }}>
                <TableRow sx={{ width: "100%" }}>
                  <StyledTableCell colSpan={2}>
                    {t("organization")}
                  </StyledTableCell>
                  <StyledTableCell colSpan={3}>{t("date")}</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedOrganizations.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                    onClick={() => handleSelectOrganization(row.id)}
                  >
                    <TableCell sx={{ width: "15%" }} component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell sx={{ width: "60%" }} component="th" scope="row">
                      {row.description}
                    </TableCell>
                    <TableCell sx={{ width: "15%" }} component="th" scope="row">
                      {row.created_at}
                    </TableCell>
                    <TableCell sx={{ width: "5%" }} component="th" scope="row">
                      {row.is_admin && <RoleChip label="ADMIN" />}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        textAlign: "right",
                        width: "5%,",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-haspopup="true"
                        onClick={() => handleOpenOrganization(row.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 15, 20, 25]}
            component="div"
            count={organizations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <Paper>
          <Typography
            variant="h6"
            component="div"
            sx={{ padding: "12px", color: "#9FA2B4" }}
          >
            {t("no_organization_available")}
          </Typography>
        </Paper>
      )}
      <Button
        sx={{
          mt: "24px",
          mb: "34px",
          backgroundColor: "organization.background.default",
          border: "1px solid #ACACAE",
          color: "text.primary",
          textTransform: "none",
        }}
        onClick={() => setOpenAddOrg(true)}
      >
        + {t("add_new_organization")}
      </Button>
      <Dialog
        open={openAddOrg}
        onClose={() => setOpenAddOrg(false)}
        aria-labelledby="responsive-dialog-title"
        sx={{ p: 5 }}
      >
        <DialogTitle id="responsive-dialog-title">
          {t("add_organization")}
        </DialogTitle>
        <DialogContent>
          <Box noValidate component="form">
            <TextField
              placeholder={t("organization_name")}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              size="small"
              sx={{
                backgroundColor: "organization.background.default",
                width: "100%",
                mb: 2,
                borderRadius: "10px",
              }}
            />
            <TextField
              placeholder={t("description")}
              value={desInput}
              onChange={(e) => setDesInput(e.target.value)}
              size="small"
              sx={{
                backgroundColor: "organization.background.default",
                width: "100%",
                borderRadius: "10px",
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ mb: 2, mr: 2 }}>
          <ButtonConfirm
            buttonType="cancel"
            buttonClick={() => setOpenAddOrg(false)}
          />
          <ButtonConfirm buttonType="ok" buttonClick={() => handleAddOrg()} />
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default OrganizationContainer;
