import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { getCookie, setCookies } from "cookies-next";
import useSWR from "swr";
import { useMutation } from "@apollo/client";
import { useUser } from "@auth0/nextjs-auth0";
import { useFormik } from "formik";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import GoogleIcon from "@mui/icons-material/Google";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import {
  validationEmail,
  validationLogin,
} from "../../components/auth/login/validate";
import {
  LOGIN_AUTH0_MUTATION,
  LOGIN_MUTATION,
} from "../../components/auth/login/graphql";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";

const theme = createTheme();

const LoginWithAuthButton = styled(LoadingButton)(() => ({
  color: "#ccc",
  width: "100%",
  marginBottom: "8px",
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
  },
}));

const LoginButton = styled(LoadingButton)(() => ({
  color: "#FFF",
  backgroundColor: "#00c6ab",
  margin: "20px auto 40px",
  padding: "10px",
  transition: "all 0.3s",
  "&:hover": {
    backgroundColor: "#00c6ab",
    opacity: "0.8",
  },
  fontSize: "16px",
  textTransform: "none",
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

const LoginFormText = styled(Typography)`
  color: #fff;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.3px;
  padding-bottom: 25px;
  padding-top: 25px;
`;
const LoginTextField = styled(TextField)({
  margin: "10px 0",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#444",
      color: "#fff !important",
      transition: "all 0.3s",
    },
    "&:hover fieldset": {
      borderColor: "#666",
    },
    "&.Mui-focused input": {
      backgroundColor: "#222",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#444",
      borderWidth: "1px !important",
    },
    input: {
      color: "#fff !important",
    },
    "input:-webkit-autofil": {
      backgroundColor: "#000",
      display: "none",
      transition: "background-color 5000s ease-in-out 0s !important",
    },
    "input:-webkit-autofil-selected": {
      backgroundColor: "#000 !important",
      transition: "background-color 5000s ease-in-out 0s !important",
    },
  },
});
const fetcherUserAuth0 = (url: string) => fetch(url).then((r) => r.json());

const AuthLogin: NextPage = () => {
  const [loginMutation, { data, loading, error, reset }] = useMutation(
    LOGIN_MUTATION,
    {
      onError(error) {
        console.error("error :>>", error.message);
      },
    }
  );
  const [loginAuth0Mutation, resLoginAuth0] = useMutation(LOGIN_AUTH0_MUTATION);
  const { error: auth0Error } = useUser();
  const { push: routerPush } = useRouter();
  const [passWordStep, setPassWordStep] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationLogin,
    onSubmit: (values) => {
      loginMutation({
        variables: {
          loginInput: {
            email: values.email,
            password: values.password,
          },
        },
      });
    },
  });

  if (data && data.login && data.login.token) {
    setCookies("token", data.login.token, {
      path: "/",
    });
    window.location.href = "/dashboard";
  }

  if (resLoginAuth0?.data?.loginAuth0?.token) {
    setCookies("token", resLoginAuth0.data.loginAuth0.token, {
      path: "/",
    });
    window.location.href = "/dashboard";
  }

  const { data: dataAuth0, error: errorAuth0 } = useSWR(
    "/api/auth/token",
    fetcherUserAuth0
  );
  useEffect(() => {
    (async () => {
      const isCookie = await getCookie("token");
      if (isCookie) {
        routerPush("/");
      }
    })();
  }, [routerPush]);
  if (
    dataAuth0 &&
    dataAuth0.session &&
    dataAuth0?.session?.idToken &&
    !errorAuth0 &&
    !resLoginAuth0?.data &&
    !resLoginAuth0.loading &&
    !resLoginAuth0.error
  ) {
    loginAuth0Mutation({
      variables: {
        auth0Input: {
          token: dataAuth0.session.idToken,
        },
      },
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Login - hxb</title>
      </Head>
      <Box sx={{ backgroundColor: "#181818", overflow: "auto" }}>
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
          <Box sx={{ width: "inherit" }}>
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "linear-gradient(#222, #181818)",
                borderRadius: "5px",
                boxShadow: "0 -10px 20px #161616",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Title>Hexabase</Title>
                <Typography sx={{ fontSize: "24px", color: "#fff" }}>
                  Log in
                </Typography>
                <LoginFormText>
                  Enter your email and password below
                </LoginFormText>
              </Box>
              <Box
                component="form"
                onSubmit={formik.handleSubmit}
                noValidate
                sx={{ mt: 1, width: "35ch" }}
              >
                {error && (
                  <Alert
                    onClose={() => {
                      reset();
                    }}
                    severity="error"
                  >
                    Your login attempt has failed. Make sure the username and
                    password are correct.
                  </Alert>
                )}
                {auth0Error && (
                  <Alert severity="error">
                    Login with auth0 error {auth0Error.message}
                  </Alert>
                )}
                <LoginTextField
                  margin="normal"
                  required
                  fullWidth
                  size="small"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  id="email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <LoginTextField
                  margin="normal"
                  required
                  fullWidth
                  size="small"
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
                <LoginButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  // sx={{ mt: 3, mb: 2, p: 1, backgroundColor: "#00c6ab", fontSize: "16px", }}
                  loading={loading || resLoginAuth0?.loading}
                >
                  LogIn
                </LoginButton>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <LoginWithAuthButton
                    type="button"
                    href="/api/auth/login?connection=google-oauth2"
                    fullWidth
                    variant="contained"
                    loading={resLoginAuth0?.loading}
                    startIcon={
                      <Image
                        alt="google"
                        src="/icons/google.svg"
                        width="20px"
                        height="20px"
                      />
                    }
                  >
                    LogIn With Google Account
                  </LoginWithAuthButton>
                  <LoginWithAuthButton
                    type="button"
                    href="/api/auth/login?connection=github"
                    fullWidth
                    variant="contained"
                    loading={resLoginAuth0?.loading}
                    startIcon={
                      <Image
                        alt="github"
                        src="/icons/github.svg"
                        width="20px"
                        height="20px"
                      />
                    }
                  >
                    LogIn With Github
                  </LoginWithAuthButton>
                </Box>
              </Box>
              <LoginFormText>
                {`Don't have an account? `}
                <Link color="inherit" href="/auth/signup">
                  Sign up
                </Link>
              </LoginFormText>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AuthLogin;
