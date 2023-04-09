import React, { useEffect, useState } from "react";
import DashboardLayout from "../../container/DashboardLayout";
import Paper from '@mui/material/Paper';
import { useRouter } from "next/router";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { StyledTableCell, TrueChip, FalseChip } from "../../container/Datastore/style";
import { useQuery } from "@apollo/client";
import { DataStore, getApplicationDatastores } from "../../recoil/atom/datastore/types";
import { DATASTORE_QUERY } from "../../graphql/datastore";

const DatastoreContainer: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();
  const { push: routerPush } = useRouter();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [datastores, setDatastores] = useState<getApplicationDatastores[]>([]);
  const [displayedDatastores, setDisplayedDatastores] = useState<getApplicationDatastores[]>([]);
  const { data, loading, error } = useQuery<DataStore>(DATASTORE_QUERY, {
    variables: {
      applicationId: router.query.applicationId
    },
  });

  useEffect(() => {
    if (!loading && data && !error) {
      if (data.getApplicationDatastores) {
        setDatastores(data.getApplicationDatastores);
      }
    }
  }, [data, loading, error])

  useEffect(() => {
    const displayed = datastores.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    setDisplayedDatastores(displayed);
  }, [page, rowsPerPage, datastores]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectDatastore = (datastoreId: string) => {
    //TODO: set current datastore
    routerPush(`/datastore/${datastoreId}`);
  }

  return (
    <DashboardLayout>
      <Paper>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="medium" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Datastore Name</StyledTableCell>
                <StyledTableCell>Display Id</StyledTableCell>
                <StyledTableCell>Uploading</StyledTableCell>
                <StyledTableCell>Imported</StyledTableCell>
                <StyledTableCell>Deleted</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedDatastores.map((row) => (
                <TableRow
                  key={row.datastore_id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  onClick={() => handleSelectDatastore(row.datastore_id)}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.display_id}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.uploading ? <TrueChip label="YES" /> : <FalseChip label="NO" />}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.imported ? <TrueChip label="YES" /> : <FalseChip label="NO" />}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.deleted ? <TrueChip label="YES" /> : <FalseChip label="NO" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={datastores.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
      </Paper>
    </DashboardLayout>
  )
};

export default DatastoreContainer;
