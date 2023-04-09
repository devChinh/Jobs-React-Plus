import React, { useEffect, useRef } from "react";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Slide,
  Typography,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import ListSubheader from "@mui/material/ListSubheader";
import { styled } from "@mui/material/styles";

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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

interface ItemDetailProps {
  data?: {
    [x: string]: string | number;
  }[];
  open: boolean | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ data, open, setOpen }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, setOpen]);

  return (
    <Slide direction="left" in={open}>
      <Drawer
        ref={wrapperRef}
        variant="permanent"
        open={open}
        anchor="right"
        sx={{
          backgroundColor: "background.drawer",
        }}
      >
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            <ChevronRightIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        {data &&
          data.map((data, index) => (
            <List
              key={index}
              sx={{
                width: "100%",
                maxWidth: 360,
                backgroundColor: "background.paper",
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
                    <span>{Object.keys(data)}</span>
                  </Box>
                </ListSubheader>
              }
            >
              <ListItem sx={{ pl: "20px", pr: "20px" }}>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "text.primary",
                      }}
                    >
                      {Object.values(data)}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          ))}
      </Drawer>
    </Slide>
  );
};

export default ItemDetail;
