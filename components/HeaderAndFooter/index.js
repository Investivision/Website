import styles from "./index.module.css";
import Link from "next/link";
import Wave from "react-wavify";
import { useTheme } from "@mui/styles";
import ThemeToggle from "../ThemeToggle";
import { useEffect, useState } from "react";
import Banner from "./Banner";
import Contact from "../contact";
import Head from "next/head";

const bottomWaveHeight = 50;

export default function HeaderAndFooter(props) {
  const theme = useTheme();

  console.log(
    props,
    `#${theme.palette.mode == "dark" ? "000000" : "ffffff"}${
      props.overlayHeader === true ? "00" : "ff"
    })`
  );

  const footerColor = theme.palette.mode == "dark" ? "#ffffff10" : "#f5f5f5";

  const headerBackground = `#ffffff${
    props.overlayHeader === true
      ? "00"
      : theme.palette.mode == "dark"
      ? "00"
      : "00"
  }`;

  useEffect(() => {
    window.onbeforeunload = undefined;
  });

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
      <Banner />
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
              <div
                className={styles.imgWrapper}
                style={{
                  backgroundColor:
                    theme.palette.mode == "light" ||
                    props.overlayHeader === true
                      ? "white"
                      : "black",
                  boxShadow: `0 0 20px 0 ${
                    theme.palette.mode == "light" ||
                    props.overlayHeader === true
                      ? `rgba(0, 0, 0, 0.1)`
                      : `rgba(255, 255, 255, 0.05)`
                  }`,
                }}
              >
                <img
                  src={`/images/${
                    theme.palette.mode == "light" ||
                    props.overlayHeader === true
                      ? ""
                      : "dark_"
                  }logo.svg`}
                />
              </div>
              <h1>Investivision</h1>
            </div>
          </Link>
          <div className={styles.nav}>
            <Link href="/insights">Insights</Link>
            <Link href="/extension">Extension</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/account">Account</Link>
            <ThemeToggle />
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
              <Link href="/">Pricing</Link>
            </div>
            <div className={styles.linksGroup}>
              <p>Account</p>
              <Link href="/">Sign in</Link>
              <Link href="/">Sign up</Link>
              <Link href="/">View Account</Link>
              <Link href="/">Subscription</Link>
            </div>
            <div className={styles.linksGroup}>
              <p>Contact</p>
              <Link href="/">Twitter</Link>
              <Link href="/">Support</Link>
            </div>
            <div className={styles.linksGroup}>
              <p>Legal</p>
              <Link href="/">Terms of Service</Link>
              <Link href="/">Data Privacy</Link>
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
        </footer>
      </div>
      <Contact />
    </>
  );
}
