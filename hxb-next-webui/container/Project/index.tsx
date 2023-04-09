import DashboardLayout from "../../container/DashboardLayout";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  ApplicationAndDataStore,
  getApplicationAndDataStore,
} from "../../recoil/atom/project/types";
import { APPLICATION_QUERY } from "../../graphql/application";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { StyledTableCell, DatastoreChip } from "../../container/Project/style";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const ProjectContainer: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { t } = useTranslation("projects");
  const router = useRouter();
  const [projects, setProject] = useState<getApplicationAndDataStore[]>([]);
  const { data, loading, error } = useQuery<ApplicationAndDataStore>(
    APPLICATION_QUERY,
    {
      variables: {
        workspaceId: router.query.workspaceId,
      },
    }
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const { push: routerPush } = useRouter();
  const [displayedProjects, setDisplayedProjects] = useState<
    getApplicationAndDataStore[]
  >([]);

  useEffect(() => {
    if (!loading && data && !error) {
      if (data.getApplicationAndDataStore) {
        setProject(data.getApplicationAndDataStore);
      }
    }
  }, [data, loading, error]);

  useEffect(() => {
    const displayed = projects.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    setDisplayedProjects(displayed);
  }, [page, rowsPerPage, projects]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectDatastore = (applicationId: string) => {
    //TODO: set current project

    routerPush({
      pathname: "/datastore",
      query: {
        applicationId: applicationId,
      },
    });
  };

  return (
    <DashboardLayout>
      <Paper>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650 }}
            size="medium"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell>{t("name")}</StyledTableCell>
                <StyledTableCell>{t("display_id")}</StyledTableCell>
                <StyledTableCell>{t("datastore")}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedProjects.map((row) => (
                <TableRow
                  key={row.application_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.display_id}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <DatastoreChip
                      label={row.datastores ? row.datastores.length : 0}
                      onClick={() => handleSelectDatastore(row.application_id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25]}
          component="div"
          count={projects.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </DashboardLayout>
  );
};

export default ProjectContainer;
