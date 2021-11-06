import styles from "./index.module.css";
import Link from "next/link";
import Wave from "react-wavify";
import theme from "../../theme";
import ***REMOVED*** ThemeProvider ***REMOVED*** from "@mui/material/styles";

const bottomWaveHeight = 50;
const footerColor = "#f5f5f5";

export default function HeaderAndFooter(props) ***REMOVED***
  return (
    <ThemeProvider theme=***REMOVED***theme***REMOVED***>
      <div className=***REMOVED***styles.page***REMOVED***>
        <header
          className=***REMOVED***styles.header***REMOVED***
          style=***REMOVED******REMOVED***
            position: props.overlayHeader === true ? "absolute" : "relative",
            backgroundColor: `rgba(255,255,255,$***REMOVED***
              props.overlayHeader === true ? 0 : 255
            ***REMOVED***)`,
            height: props.overlayHeader === true ? 80 : 60,
          ***REMOVED******REMOVED***
        >
          <a href="/">
            <img src="/images/logo.svg" />
            <h1>Investivision</h1>
          </a>
          <div className=***REMOVED***styles.nav***REMOVED***>
            <Link href="/Features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/account">Account</Link>
          </div>
        </header>
        <div
          style=***REMOVED******REMOVED***
            flex: 1,
          ***REMOVED******REMOVED***
          className=***REMOVED***`$***REMOVED***props.bodyClassName***REMOVED***`***REMOVED***
        >
          ***REMOVED***props.children***REMOVED***
        </div>
        <footer
          className=***REMOVED***styles.footer***REMOVED***
          style=***REMOVED******REMOVED***
            // marginTop: bottomWaveHeight,
            backgroundColor: footerColor,
            // border: props.hideFooterWave ? "1px solid #dadada" : "none",
          ***REMOVED******REMOVED***
        >
          ***REMOVED***props.hideFooterWave ? null : (
            <Wave
              style=***REMOVED******REMOVED***
                height: bottomWaveHeight,
                marginBottom: 0,
                position: "absolute",
                top: 0,
                left: 0,
                transform: "translateY(-100%)",
              ***REMOVED******REMOVED***
              fill=***REMOVED***footerColor***REMOVED***
              paused=***REMOVED***false***REMOVED***
              options=***REMOVED******REMOVED***
                amplitude: bottomWaveHeight / 2.5,
                speed: 0.17,
                points: 3,
              ***REMOVED******REMOVED***
            />
          )***REMOVED***
          <div className=***REMOVED***styles.footerLinks***REMOVED***>
            <div className=***REMOVED***styles.linksGroup***REMOVED***>
              <p>Browse</p>
              <Link href="/">Home</Link>
              <Link href="/">Extension</Link>
              <Link href="/">Explorer</Link>
              <Link href="/">Pricing</Link>
            </div>
            <div className=***REMOVED***styles.linksGroup***REMOVED***>
              <p>Account</p>
              <Link href="/">Sign in</Link>
              <Link href="/">Sign up</Link>
              <Link href="/">View Acccount</Link>
            </div>
          </div>
          <p className=***REMOVED***styles.disclaimer***REMOVED***>
            Disclaimer: All investment strategies and investments involve risk
            of loss. Nothing contained in this platform or its services should
            be construed as investment advice.
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
***REMOVED***
