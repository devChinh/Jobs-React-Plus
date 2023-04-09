import { UserProvider } from "@auth0/nextjs-auth0";
import { RecoilRoot } from "recoil";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "@mui/material/styles";
import apolloClient from "../apollo-client";
import { appWithTranslation } from "next-i18next";
import { getCookie, setCookies } from "cookies-next";
import { useEffect, useState } from "react";
import { createTheme, useMediaQuery } from "@mui/material";
import createEmotionCache from "../modules/createEmotionCache";
import { CacheProvider } from "@emotion/react";
import ColorModeContext from "../modules/styles/ColorModeContext";
import { getDesignTokens } from "../modules/brandingTheme";

// const client = apolloClient({
//   uri: process.env.NEXT_PUBLIC_HOST_GRAPHQL || "http://localhost:3001/graphql",
// });

const client = apolloClient({
  uri: "/graphql",
});

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function MyApp(props: any) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // Set dark mode based on media query
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  useEffect(() => {
    const mode = getCookie("darkMode");
    if (typeof mode === "boolean") {
      setDarkMode(mode);
    } else {
      setCookies("darkMode", true);
    }
  }, []);

  const _setDarkMode = (newMode: boolean) => {
    setCookies("darkMode", newMode);
    setDarkMode(newMode);
  };

  const theme = createTheme(getDesignTokens(darkMode ? "dark" : "light"));
  return (
    <CacheProvider value={emotionCache}>
      <ColorModeContext.Provider
        value={{ darkMode, setDarkMode: _setDarkMode }}
      >
        <ThemeProvider theme={theme}>
          <UserProvider>
            <RecoilRoot>
              <ApolloProvider client={client}>
                <Component {...pageProps} />
              </ApolloProvider>
            </RecoilRoot>
          </UserProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </CacheProvider>
  );
}

export default appWithTranslation(MyApp);
