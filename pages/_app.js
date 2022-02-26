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
        description="Your source for (actually) non-speculative, data-driven stock insights from the future. Explore our vast database of 4000+ stocks, updated daily."
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
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#516fdb" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
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
