import * as React from "react";
import { ServerStyleSheets as JSSServerStyleSheets } from "@mui/styles";
import { ServerStyleSheet } from "styled-components";
import createEmotionServer from "@emotion/server/create-instance";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import createEmotionCache from "../modules/createEmotionCache";
import GlobalStyles from "@mui/material/GlobalStyles";
import MuiGlobalStyle from "../modules/styles/globalStyle";
import { getCookie } from "cookies-next";

// You can find a benchmark of the available CSS minifiers under
// https://github.com/GoalSmashers/css-minification-benchmark
// We have found that clean-css is faster than cssnano but the output is larger.
// Waiting for https://github.com/cssinjs/jss/issues/279
// 4% slower but 12% smaller output than doing it in a single step.
//
// It's using .browserslistrc
let prefixer: any = undefined;
let cleanCSS: any = undefined;
if (process.env.NODE_ENV === "production") {
  /* eslint-disable global-require */
  const postcss = require("postcss");
  const autoprefixer = require("autoprefixer");
  const CleanCSS = require("clean-css");
  /* eslint-enable global-require */

  prefixer = postcss([autoprefixer]);
  cleanCSS = new CleanCSS();
}

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/*
            manifest.json provides metadata used when your web app is added to the
            homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/
          */}
          <link rel="manifest" href="/manifest.json" />
          <link
            href="https://fonts.gstatic.com"
            rel="preconnect"
            crossOrigin="anonymous"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://unpkg.com/@ag-grid-community/core@27.3.0/dist/styles/ag-grid.css"
          />

          <link
            rel="stylesheet"
            href="https://unpkg.com/@ag-grid-community/core@27.3.0/dist/styles/ag-theme-balham.css"
          />
          <link
            rel="stylesheet"
            href="https://unpkg.com/@ag-grid-community/core@27.3.0/dist/styles/ag-theme-balham-dark.css"
          />
          <link // prevent font flash
            rel="preload"
            // optimized for english characters (40kb -> 6kb)
            href="/static/fonts/PlusJakartaSans-ExtraBold-subset.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <GlobalStyles
            styles={{
              // First SSR paint
              ".only-light-mode": {
                display: "block",
              },
              ".only-dark-mode": {
                display: "none",
              },
              // Post SSR Hydration
              ".mode-dark .only-light-mode": {
                display: "none",
              },
              ".mode-dark .only-dark-mode": {
                display: "block",
              },
            }}
          />
          <GlobalStyles styles={MuiGlobalStyle} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const jssSheets = new JSSServerStyleSheets();
  const styledComponentsSheet = new ServerStyleSheet();
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          styledComponentsSheet.collectStyles(
            jssSheets.collect(<App {...props} />)
          ),
      });

    const initialProps = await Document.getInitialProps(ctx);
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(" ")}`}
        key={style.key}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    let css = jssSheets.toString();
    // It might be undefined, e.g. after an error.
    if (css && process.env.NODE_ENV === "production") {
      const result1 = await prefixer.process(css, { from: undefined });
      css = result1.css;
      css = cleanCSS.minify(css).styles;
    }

    return {
      ...initialProps,

      // Styles fragment is rendered after the app and page rendering finish.
      styles: [
        <style id="material-icon-font" key="material-icon-font" />,
        <style id="font-awesome-css" key="font-awesome-css" />,
        styledComponentsSheet.getStyleElement(),
        ...emotionStyleTags,
        <style
          id="jss-server-side"
          key="jss-server-side"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: css }}
        />,
        <style id="app-search" key="app-search" />,
        <style id="prismjs" key="prismjs" />,
        <style id="insertion-point-jss" key="insertion-point-jss" />,
        ...React.Children.toArray(initialProps.styles),
      ],
    };
  } finally {
    styledComponentsSheet.seal();
  }
};
