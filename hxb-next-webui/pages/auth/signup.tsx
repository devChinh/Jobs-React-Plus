import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useMutation } from "@apollo/client";
import LoadingButton from "@mui/lab/LoadingButton";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { useRecoilValue } from "recoil";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import { TErrorSignup } from "../../recoil/atom/errorSignUp/type";
import { errorSignupState } from "../../recoil/atom/errorSignUp";

const theme = createTheme();

const SignUpWithAuthButton = styled(LoadingButton)(() => ({
  color: "#eee",
  width: "100%",
  marginBottom: "8px",
  padding: "8px",
  border: "1px solid #555",
  backgroundColor: "#222",
  justifyContent: "center",
  "&:hover": {
    backgroundColor: "#333",
    color: "#fff",
  },
  fontSize: "14px",
  fontWeight: "normal",
  textTransform: "none",
  "& .MuiButton-startIcon": {
    position: "absolute",
    left: "20px",
  },
  "&[href*=github] .MuiButton-startIcon": {
    background: "#ddd",
    borderRadius: "50%",
    padding: "1px",
  }
}));

const Title = styled(Typography)`
  color: #fff;
  font-style: normal;
  font-weight: bold;
  font-size: 19px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.4px;
  margin-bottom: 12px;
  margin-top: 20px;
`;

const SignUpFormText = styled(Typography)`
  color: #999;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.3px;
  padding-bottom: 40px;
  padding-top: 40px;
`;

const AuthSignUp: NextPage = () => {

  const errorSignup: TErrorSignup = useRecoilValue(
    errorSignupState
  );

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>SignUp - hxb</title>
      </Head>
      <Box sx={{ backgroundColor: "#181818", overflow: "auto", }}>
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            minHeight: "100vh",
            paddingTop: "25px",
            paddingBottom: "25px",
          }}
          maxWidth="xs"
        >
          <Box sx={{ width: "inherit", mb: "20px", }}>
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "40px 0 0",
                background: "linear-gradient(#222, #181818)",
                borderRadius: "5px",
                boxShadow: "0 -10px 20px #161616",
              }}
            >
              <Box sx={{ mb: "30px", textAlign: "center", }}>
                <Title>Hexabase</Title>
                <Typography sx={{ fontSize: "28px", color: "#fff" }}>
                  Sign Up
                </Typography>
              </Box>
              <Box
                sx={{
                  mt: 1,
                  width: "35ch",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {errorSignup && errorSignup.message && (
                  <Alert severity="error">
                    {errorSignup.message}
                  </Alert>
                )}
                <SignUpWithAuthButton
                  type="button"
                  href="/api/auth/signup?connection=google-oauth2"
                  
                  fullWidth
                  variant="contained"
                  sx={{ mt: 1, mb: 1, width: "100%" }}
                  // loading={resSignupAuth0?.loading}
                  startIcon={
                    <Image
                      alt="google"
                      src="/icons/google.svg"
                      width="20px"
                      height="20px"
                    />
                  }
                >
                  SignUp With Google Account
                </SignUpWithAuthButton>
                <SignUpWithAuthButton
                  type="button"
                  href="/api/auth/signup?connection=github"
                  
                  fullWidth
                  variant="contained"
                  sx={{ mt: 1, mb: 1, width: "100%" }}
                  // loading={resSignupAuth0?.loading}
                  startIcon={
                    <Image
                      alt="github"
                      src="/icons/github.svg"
                      width="20px"
                      height="20px"
                    />
                  }
                >
                  SignUp With Github Account
                </SignUpWithAuthButton>
              </Box>
              <SignUpFormText>
                {`Do you have an account? `}
                <Link color="inherit" href="/auth/login">
                  Sign in
                </Link>
              </SignUpFormText>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AuthSignUp;
