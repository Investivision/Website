import "../styles/globals.css";
import Head from "next/head";
import Theme from "./Theme";
import CssBaseline from "@mui/material/CssBaseline";
import { NextSeo } from "next-seo";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NextSeo
        title="Investivision"
        description="Non-speculative, data-driven stock insights from the future."
        openGraph={{
          images: [
            {
              url: "/thumb.png",
              width: 1200,
              height: 803,
            },
          ],
        }}
      />
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <meta name="viewport" content="width=500" />
        {/* <meta
          id="vp"
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <script>
          {`window.onload = function() {
              if (screen.width < 500) {
                  var mvp = document.getElementById('vp');
                  mvp.setAttribute('content','user-scalable=no,width=500');
              }
          }`}
        </script> */}
      </Head>
      <CssBaseline />
      <Theme>
        <Component {...pageProps} />
      </Theme>
    </>
  );
}

export default MyApp;
