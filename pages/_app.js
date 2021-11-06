import "../styles/globals.css";
import Head from "next/head";

function MyApp(***REMOVED*** Component, pageProps ***REMOVED***) ***REMOVED***
  return (
    <>
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
      </Head>
      <Component ***REMOVED***...pageProps***REMOVED*** />
    </>
  );
***REMOVED***

export default MyApp;
