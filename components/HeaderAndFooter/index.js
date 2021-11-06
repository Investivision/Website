import styles from "./index.module.css";
import Link from "next/link";
import Wave from "react-wavify";
import theme from "../../theme";
import { ThemeProvider } from "@mui/material/styles";

const bottomWaveHeight = 50;
const footerColor = "#f5f5f5";

export default function HeaderAndFooter(props) {
  return (
    <ThemeProvider theme={theme}>
      <div className={styles.page}>
        <header
          className={styles.header}
          style={{
            position: props.overlayHeader === true ? "absolute" : "relative",
            backgroundColor: `rgba(255,255,255,${
              props.overlayHeader === true ? 0 : 255
            })`,
            height: props.overlayHeader === true ? 80 : 60,
          }}
        >
          <a href="/">
            <img src="/images/logo.svg" />
            <h1>Investivision</h1>
          </a>
          <div className={styles.nav}>
            <Link href="/Features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/account">Account</Link>
          </div>
        </header>
        <div
          style={{
            flex: 1,
          }}
          className={`${props.bodyClassName}`}
        >
          {props.children}
        </div>
        <footer
          className={styles.footer}
          style={{
            // marginTop: bottomWaveHeight,
            backgroundColor: footerColor,
            // border: props.hideFooterWave ? "1px solid #dadada" : "none",
          }}
        >
          {props.hideFooterWave ? null : (
            <Wave
              style={{
                height: bottomWaveHeight,
                marginBottom: 0,
                position: "absolute",
                top: 0,
                left: 0,
                transform: "translateY(-100%)",
              }}
              fill={footerColor}
              paused={false}
              options={{
                amplitude: bottomWaveHeight / 2.5,
                speed: 0.17,
                points: 3,
              }}
            />
          )}
          <div className={styles.footerLinks}>
            <div className={styles.linksGroup}>
              <p>Browse</p>
              <Link href="/">Home</Link>
              <Link href="/">Extension</Link>
              <Link href="/">Explorer</Link>
              <Link href="/">Pricing</Link>
            </div>
            <div className={styles.linksGroup}>
              <p>Account</p>
              <Link href="/">Sign in</Link>
              <Link href="/">Sign up</Link>
              <Link href="/">View Acccount</Link>
            </div>
          </div>
          <p className={styles.disclaimer}>
            Disclaimer: All investment strategies and investments involve risk
            of loss. Nothing contained in this platform or its services should
            be construed as investment advice.
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
}
