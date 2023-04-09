import React, { useEffect, useState } from "react";

import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "next-i18next";

import { TUserInOrg } from "../../recoil/atom/organization/types";
interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

interface Props {
  userInOrg: TUserInOrg[];
}

const OrganizationUsersComponent: React.FC<Props> = ({ userInOrg }) => {
  const { t } = useTranslation("organization");

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [displayedUsers, setDisplayedUsers] = useState<TUserInOrg[]>();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<readonly string[]>([]);

  useEffect(() => {
    const displayed = userInOrg?.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    setDisplayedUsers(displayed);
  }, [page, rowsPerPage, userInOrg]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = userInOrg.map((n) => n.user_name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  return (
    <TableContainer
      sx={{
        width: "100%",
        height: "85vh",
        overflowX: "auto",
        "&::-webkit-scrollbar": {
          width: "0px",
          height: "0px",
        },
      }}
    >
      <Table
        sx={{
          maxWidth: "100%",
          backgroundColor: "background.paper",
          backgroundImage: "unset",
        }}
        aria-labelledby="tableTitle"
        size={"small"}
      >
        <TableHead>
          <TableRow>
            <TableCell align="left" colSpan={6}>
              {t("organization_users")}
            </TableCell>
          </TableRow>
        </TableHead>
        {typeof userInOrg === "undefined" || userInOrg.length === 0 ? (
          <Typography sx={{ color: "text.primary" }}>
            {t("no_organization_users")}
          </Typography>
        ) : (
          <TableBody>
            <Table
              sx={{
                maxWidth: "80%",
                backgroundColor: "#f7f7f7",
                backgroundImage: "unset",
                ml: 2,
                mt: 2,
              }}
              aria-labelledby="tableTitle"
              size={"small"}
            >
              <TableBody>
                <TableRow>
                  <TableCell
                    align="left"
                    colSpan={6}
                    padding="checkbox"
                    sx={{
                      color: "#212226",
                      m: 2,
                      pt: "12px!important",
                      pb: "12px!important",
                    }}
                  >
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selected.length > 0 &&
                        selected.length < userInOrg.length
                      }
                      checked={
                        userInOrg?.length > 0 &&
                        selected.length === userInOrg.length
                      }
                      onChange={handleSelectAllClick}
                      inputProps={{
                        "aria-label": "select all desserts",
                      }}
                    />
                  </TableCell>
                </TableRow>
                {displayedUsers?.map((user, index) => {
                  const isItemSelected = isSelected(user.user_name);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, user.user_name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={user.user_id}
                      selected={isItemSelected}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        cursor: "pointer",
                      }}
                    >
                      <TableCell
                        padding="checkbox"
                        sx={{ width: "10%", color: "#212226", m: 2 }}
                      >
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        padding="none"
                        sx={{ width: "80%", color: "#212226", m: 2 }}
                      >
                        <TableRow sx={{ fontSize: "14px", m: 2 }}>
                          {user.user_name}
                        </TableRow>
                        <TableRow sx={{ fontSize: "12px", m: 2 }}>
                          {user.email}
                        </TableRow>
                      </TableCell>
                      <TableCell
                        sx={{ width: "10%", color: "#212226", m: 2 }}
                        align="right"
                      >
                        <IconButton>
                          <PersonRemoveIcon sx={{ color: "#212226" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow
                  sx={{
                    [`& .${tableCellClasses.root}`]: {
                      borderBottom: "none",
                      borderTop: "none",
                    },
                  }}
                >
                  <TableCell align="right" colSpan={6}>
                    <TablePagination
                      rowsPerPageOptions={[
                        10,
                        15,
                        20,
                        25,
                        { label: "All", value: -1 },
                      ]}
                      colSpan={3}
                      component="div"
                      count={userInOrg?.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: {
                          "aria-label": "rows per page",
                        },
                        native: true,
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                      sx={{
                        color: "#212226",
                        width: "100%",
                        "& .MuiSvgIcon-root": { color: "#212226" },
                        "& .MuiTablePagination-menuItem": {
                          backgroundColor: "#ffffff!important",
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" colSpan={6}>
                    <Button
                      sx={{
                        background: "#0accb2",
                        color: "text.primary",
                        textTransform: "none",
                        height: "32px",
                        "&:hover": {
                          color: "text.primary",
                          backgroundColor: "#0accb2",
                        },
                      }}
                    >
                      <IconButton>
                        <PersonAddIcon sx={{ color: "text.primary" }} />
                      </IconButton>
                      {t("add_user")}
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
};

export default OrganizationUsersComponent;
