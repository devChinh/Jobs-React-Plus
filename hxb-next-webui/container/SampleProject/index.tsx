import React, { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import { useTranslation } from "next-i18next";
import {
  Avatar,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type TSampleProject = {
  name: string;
  description: string;
};

const sampleProject: TSampleProject[] = [
  {
    name: "Todo list app 1",
    description: "Description of sample app 1",
  },
  {
    name: "Todo list app 2",
    description: "Description of sample app 2",
  },
  {
    name: "Todo list app 3",
    description: "Description of sample app 3",
  },
  {
    name: "Todo list app 4",
    description: "Description of sample app 4",
  },
];

const clientLibrary = [
  {
    name: "Graphql",
    description:
      "A JavaScript library for application development using cloud services",
    img: "https://commons.wikimedia.org/wiki/File:GraphQL_Logo.svg",
  },
  {
    name: "React Js",
    description:
      "React is an open source JavaScript framework, that isn't actually a framework",
    img: "https://vi.m.wikipedia.org/wiki/T%E1%BA%ADp_tin:React-icon.svg",
  },
  {
    name: "Next Js",
    description:
      "Next.js is a React framework that gives you building blocks to create web applications",
    img: "https://ui-lib.com/blog/nextjs-boilerplates/",
  },
];

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0.9),
  color: theme.palette.text.primary,
  minHeight: 134,
  cursor: "pointer",
  border: "1px solid #565659",
  transition: "all .2s",
  "&:hover": {
    border: "1px solid",
    borderColor: "#00c6ab",
    padding: theme.spacing(0.9),
    "& .cardTitle": {
      color: "#00c6ab",
    },
    "& .cardContent": {
      color: "#00c6ab",
    },
  },
}));
const ItemLib = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

const SampleProjectContainer: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { t } = useTranslation("common");
  const [copySuccess, setCopySuccess] = useState<{
    copied: boolean;
    key: string;
  }>({ copied: false, key: "" });

  const tokenKey =
    "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTYxNTU0NjIsImlhdCI6MTY1NTgwOTg2Miwic3ViIjoiNWFmMzA3NjZiYWE4ZGYwMDA3OTE4ZWQ4IiwidW4iOiJ1c2VybmFtZSB0ZXN0In0.Eig37a9MIaFJ-ArSfwS9gNpG7IC46LSHMAqXcce-sgVDgIffVhhxVm69je2go6-JrVeW-ZTC8z0k0avkzjLn8UPAtPtgbIl3ZudK1OIcI3Cy1zys4s9WwRjwV02kPBbIGlBjLJxXVGz-cjTPCiKYPXaJdKqBRCgRnxdHv3co0XN0jzMYQQoxyvxBJnEyzSOjlsTSk3tx_C7zp358ZHGRiY7VisxhxwVDzHqYYpYrjza_rd76U4_lKXF9puVnZzhQpH2uI_7iQ5bnyFHCGMhge4h6iZoYSG5_UOoMTKpoWX5U_VlRtmz7uQfBFyjVzi7Z05KTRD_a_Hoihh-tMJsfRA";
  const urlStaging = "http://dev-next-webui.hexabase.com/";
  const urlProduction = "http://product-next-webui.hexabase.com/";
  const copyToClipboard = (key: string) => {
    navigator.clipboard
      .writeText(
        key === "tokenKey"
          ? tokenKey
          : key === "urlStaging"
          ? urlStaging
          : key === "urlProduction"
          ? urlProduction
          : ""
      )
      .then()
      .catch((e) => console.error(e));
    setCopySuccess({ copied: true, key: key });
  };

  useEffect(() => {
    if (copySuccess.copied) {
      setTimeout(() => {
        setCopySuccess((prevCopySuccess) => ({
          ...prevCopySuccess,
          copied: false,
        }));
      }, 500);
    }
  }, [copySuccess, copySuccess.copied]);

  return (
    <DashboardLayout>
      <Paper sx={{ p: 1, mb: 5 }}>
        <Container sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Project API Key
          </Typography>
          <Typography sx={{ color: "workspace.text.primary" }}>
            Your API is secued behind an API gateway witch requies an API Key
            for every request. <br />
            You can use the keys below to use Supabase client libraries.
          </Typography>
        </Container>
        <Divider />
        <Container>
          <Box
            sx={{
              mt: 1,
              color: "workspace.text.primary",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <TextField
                disabled
                sx={{
                  width: "85%",
                  backgroundColor: "workspace.background.box",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-input": {
                    color: "workspace.text.primary",
                  },
                }}
                size="small"
                id="token-key"
                label=""
                value={tokenKey}
              />
              <Button
                variant="outlined"
                sx={{
                  width: "10%",
                  borderColor: "inherit",
                  color: "inherit",
                  backgroundColor: "background.boxModal",
                }}
                onClick={() => copyToClipboard("tokenKey")}
              >
                <ContentCopyIcon fontSize="small" color="disabled" />{" "}
                {copySuccess.copied && copySuccess.key === "tokenKey"
                  ? "Copied!"
                  : "Copy"}
              </Button>
            </Box>
            <Typography>
              This key is safe to use in a browser if you have enabled Row Level
              Security for your tables and configured policies.
            </Typography>
          </Box>
        </Container>
      </Paper>
      <Paper sx={{ p: 1, mb: 5 }}>
        <Container sx={{ mb: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            URL for staging
          </Typography>
        </Container>
        <Container>
          <Box
            sx={{
              mt: 1,
              color: "workspace.text.primary",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <TextField
                disabled
                sx={{
                  width: "85%",
                  backgroundColor: "workspace.background.box",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-input": {
                    color: "workspace.text.primary",
                  },
                }}
                size="small"
                id="token-key"
                label=""
                value={urlStaging}
              />
              <Button
                variant="outlined"
                sx={{
                  width: "10%",
                  borderColor: "inherit",
                  color: "inherit",
                  backgroundColor: "background.boxModal",
                }}
                onClick={() => copyToClipboard("urlStaging")}
              >
                <ContentCopyIcon fontSize="small" color="disabled" />{" "}
                {copySuccess.copied && copySuccess.key === "urlStaging"
                  ? "Copied!"
                  : "Copy"}
              </Button>
            </Box>
          </Box>
        </Container>
        <Container sx={{ mb: 2, mt: 3 }}>
          <Typography variant="subtitle1" sx={{ my: 2 }}>
            URL for production
          </Typography>
        </Container>
        <Container>
          <Box
            sx={{
              mt: 1,
              color: "workspace.text.primary",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <TextField
                disabled
                sx={{
                  width: "85%",
                  backgroundColor: "workspace.background.box",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-input": {
                    color: "workspace.text.primary",
                  },
                }}
                size="small"
                id="token-key"
                label=""
                value={urlProduction}
              />
              <Button
                variant="outlined"
                sx={{
                  width: "10%",
                  borderColor: "inherit",
                  color: "inherit",
                  backgroundColor: "background.boxModal",
                }}
                onClick={() => copyToClipboard("urlProduction")}
              >
                <ContentCopyIcon fontSize="small" color="disabled" />{" "}
                {copySuccess.copied && copySuccess.key === "urlProduction"
                  ? "Copied!"
                  : "Copy"}
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      <Box sx={{ mt: 2 }}>
        <Typography
          variant="h3"
          gutterBottom
          component="div"
          sx={{ color: "text.primary" }}
        >
          {t("client_library")}
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1} columns={12} alignItems="stretch">
            {clientLibrary &&
              clientLibrary.map((item, index) => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  sx={{ height: "100%" }}
                  key={index}
                >
                  <ItemLib>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar src={`${item.img}`} />
                        <Typography
                          sx={{ ml: 2, mb: 0, color: "text.primary" }}
                          variant="h6"
                          gutterBottom
                          component="div"
                        >
                          {item.name}
                        </Typography>
                      </Box>
                      <ArrowForwardIosIcon fontSize="small" />
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body1" gutterBottom component="div">
                        {item.description}
                      </Typography>
                    </Box>
                  </ItemLib>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography
          variant="h3"
          gutterBottom
          component="div"
          sx={{ color: "text.primary" }}
        >
          {t("sample_project")}
        </Typography>
        <Box sx={{ width: "100%", mt: 2 }}>
          <Grid container rowSpacing={1} columnSpacing={1}>
            {sampleProject &&
              sampleProject.map((itemSampleProject, index) => (
                <Grid item xs={6} key={index}>
                  <Item>
                    <Box>
                      <Typography variant="h6" gutterBottom component="div">
                        {itemSampleProject.name}
                      </Typography>
                      <Typography variant="body1" gutterBottom component="div">
                        {itemSampleProject.description}
                      </Typography>
                    </Box>
                    <Box sx={{ margin: "auto 0" }}>
                      <ArrowForwardIosIcon fontSize="small" />
                    </Box>
                  </Item>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default SampleProjectContainer;
