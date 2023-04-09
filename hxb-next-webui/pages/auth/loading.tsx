import type { NextPage } from "next";
import { useMutation } from "@apollo/client";
import { SIGNUP_AUTH0 } from "../../components/auth/login/graphql";
import { getCookie, setCookies } from "cookies-next";
import { useUser } from "@auth0/nextjs-auth0";
import {useRouter} from "next/router";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { TErrorSignup } from "../../recoil/atom/errorSignUp/type";
import { errorSignupState } from "../../recoil/atom/errorSignUp";
import { errorMessageGraphql } from "../../utils/graphqlError";
import { CircularProgress } from '@mui/material';
import Box from "@mui/material/Box";

const fetcherUserAuth0 = (url: string) => fetch(url).then((r) => r.json());
const AuthLoading: NextPage = () => {
  const [signupAuth0Mutation, resSignupAuth0 ] = useMutation(SIGNUP_AUTH0);
  const [errorSignUp, setErrorSignupState] = useRecoilState<TErrorSignup>(
    errorSignupState
  );
  const { error: auth0Error } = useUser();
  const { push: routerPush } = useRouter();
  const [firstLoad, setFirstLoad] = useState(true);

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

  if (!process.browser) {
    return null;
  }
  if (resSignupAuth0?.data?.signUpAuth0?.token) {
    setCookies("token", resSignupAuth0.data.signUpAuth0.token, {
      path: "/",
    });
    routerPush('/dashboard/');
  } 
  if (resSignupAuth0?.error) {
    setErrorSignupState({
      isError: true,
      message: `Signup with auth0 error ${errorMessageGraphql(resSignupAuth0?.error)}`,
    });
    routerPush('/auth/signup/');
  }

  if (auth0Error) {
    setErrorSignupState({
      isError: true,
      message: `Error get user by auth0 ${auth0Error?.message}`,
    });
    routerPush('/auth/signup/');
  }

  if (
    firstLoad &&
    dataAuth0 &&
    dataAuth0.session &&
    dataAuth0?.session?.idToken &&
    !errorAuth0 &&
    !resSignupAuth0.data &&
    !resSignupAuth0.loading &&
    !resSignupAuth0.error
  ) {
    setFirstLoad(false);
    signupAuth0Mutation({
      variables: {
        auth0Input: {
          token: dataAuth0?.session?.idToken,
        },
      },
    });
  }

  return (
    <>
      <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "80vh",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
    </>
  );
};

export default AuthLoading;
