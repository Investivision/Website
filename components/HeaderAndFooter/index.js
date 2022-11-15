import styles from "./index.module.css";
import Link from "next/link";
import Wave from "react-wavify";
import { useTheme } from "@mui/styles";
import ThemeToggle from "../ThemeToggle";
import { useEffect, useState } from "react";
import Banner from "./Banner";
import Contact from "../contact";
import Head from "next/head";
import CookieConsent from "./CookieConsent";

const bottomWaveHeight = 50;

export default function HeaderAndFooter(props) {
  const theme = useTheme();

  const [isDevMode, setIsDevMode] = useState(false);

  const footerColor = theme.palette.mode == "dark" ? "#ffffff10" : "#f5f5f5";

  const headerBackground = `#ffffff${
    props.overlayHeader === true
      ? "00"
      : theme.palette.mode == "dark"
      ? "00"
      : "00"
  }`;

  useEffect(() => {
    setIsDevMode(window.location.hostname == "localhost");
  }, []);

  return (
    <>
      {/* {props.banner? (
        <div className={styles.banners}>
          {banners.map((banner) => {
            return (
              <div>
                <Link key={banner.title} href={banner.link}>
                  {banner.title}
                </Link>
                <span
                  onClick={() => {
                    setBannerOpen(false);
                  }}
                >
                  Close
                </span>
              </div>
            );
          })}
        </div>
      ) : null} */}
      <Head>
        <meta name="theme-color" content={theme.palette.background.main} />
      </Head>
      <Banner
        id="INSIGHT50"
        title="50% off with code INSIGHT50"
        link="/pricing"
      />
      {isDevMode && <Banner developmentMode />}

      <div {...props} className={styles.page}>
        <header
          className={styles.header}
          style={{
            position: props.overlayHeader === true ? "absolute" : "relative",
            backgroundColor: headerBackground,
            height: props.overlayHeader === true ? 80 : 60,
          }}
        >
          <Link href="/">
            <div
              style={{
                cursor: "pointer",
              }}
            >
              <h1
                style={{
                  display: "flex",
                  // flexDir
                  justifyContent: "center",
                  alignItems: "center",
                  // color: "#0C1D59",
                }}
              >
                <div
                  className={styles.imgWrapper}
                  // style={{
                  //   backgroundColor:
                  //     theme.palette.mode == "light" ||
                  //     props.overlayHeader === true
                  //       ? "white"
                  //       : "black",
                  //   boxShadow: `0 0 20px 0 ${
                  //     theme.palette.mode == "light" ||
                  //     props.overlayHeader === true
                  //       ? `rgba(0, 0, 0, 0.1)`
                  //       : `rgba(255, 255, 255, 0.05)`
                  //   }`,
                  // }}
                >
                  <img
                    // src={`/images/${
                    //   theme.palette.mode == "light" ||
                    //   props.overlayHeader === true
                    //     ? ""
                    //     : "dark_"
                    // }logo.svg`}
                    src="/matrix_icon.svg"
                  />
                </div>
                Tensor Investor
              </h1>
            </div>
          </Link>
          <nav>
            <ul className={styles.nav}>
              <li>
                <Link href="/screener">Screener</Link>
              </li>
              <li>
                <Link href="/compare">Compare</Link>
              </li>
              <li>
                <Link href="/extension">Ext</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
              <li>
                <Link href="/account">Account</Link>
              </li>

              <ThemeToggle />
            </ul>
          </nav>
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
              <Link href="/screener">Screener</Link>
              <Link href="/">Extension</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/faq">FAQ</Link>
            </div>
            <div className={styles.linksGroup}>
              <p>Account</p>
              <Link href="/login">Login | Sign Up</Link>
              <Link href="/account">View Account</Link>
              <Link href="/account#profile">Profile</Link>
              <Link href="/account#subscription">Subscription</Link>
            </div>
            <div className={styles.linksGroup}>
              <p>Contact</p>
              <Link href="https://twitter.com/investivision">Twitter</Link>
              <a
                onClick={() => {
                  document.getElementById("supportIcon").click();
                }}
              >
                Support
              </a>
            </div>
            <div className={styles.linksGroup}>
              <p>Legal</p>
              <Link href="/terms">Terms and Conditions</Link>
              <Link href="/privacy">Privacy Policy</Link>
            </div>
          </div>
          <p className={styles.disclaimer}>
            Disclaimer: All investment strategies and investments involve risk
            of loss. Nothing contained in this platform or its services should
            be construed as investment advice. The research reports and the
            information derived from such reports that are included on this
            website are provided for information purposes only. This content is
            not a solicitation of any offer to buy or sell any security or other
            financial instrument or to participate in any trading strategy. This
            site does not make any representation or guarantee relating to the
            accuracy, timeliness, or completeness of information presented or
            the data on which they are based.
          </p>
          <p
            className={styles.copyright}
          >{`Copyright © Blake Sanie ${new Date().getFullYear()}`}</p>
        </footer>
      </div>
      <Contact />
      <CookieConsent />
    </>
  );
}
