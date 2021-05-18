import Document, ***REMOVED*** Html, Head, Main, NextScript ***REMOVED*** from "next/document";

class MyDocument extends Document ***REMOVED***
  static async getInitialProps(ctx) ***REMOVED***
    const initialProps = await Document.getInitialProps(ctx);
    return ***REMOVED*** ...initialProps ***REMOVED***;
  ***REMOVED***

  render() ***REMOVED***
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
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
