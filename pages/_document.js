import Document, ***REMOVED*** Html, Head, Main, NextScript ***REMOVED*** from "next/document";

class MyDocument extends Document ***REMOVED***
  render() ***REMOVED***
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Asap:wght@400;500&display=swap"
            rel="stylesheet"
          />
          ***REMOVED***/* <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          /> */***REMOVED***
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  ***REMOVED***
***REMOVED***

export default MyDocument;
