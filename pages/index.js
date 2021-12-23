import HeaderAndFooter from "../components/HeaderAndFooter";
import styles from "./index.module.css";
import Wave from "react-wavify";
import { isChrome, isEdge } from "react-device-detect";
import { useState, useEffect } from "react";
import MemoryRoundedIcon from "@material-ui/icons/MemoryRounded";
import StorageRoundedIcon from "@material-ui/icons/StorageRounded";
import AssessmentRoundedIcon from "@material-ui/icons/AssessmentRounded";
import ExtensionRoundedIcon from "@material-ui/icons/ExtensionRounded";
import SpeedRoundedIcon from "@material-ui/icons/SpeedRounded";
import CompareArrowsRoundedIcon from "@material-ui/icons/CompareArrowsRounded";
import GridOnRoundedIcon from "@material-ui/icons/GridOnRounded";
import Particles from "react-tsparticles";
import { useTheme } from "@mui/material/styles";
import ExtView from "./ext";

const iconColor = "#7EA0FF !important";

const otherServices = ["robinhood", "etrade", "td", "tradingview", "finviz"];

export default function Home() {
  const theme = useTheme();

  const [browser, setBrowser] = useState(undefined);
  const [browserLoaded, setBrowserLoaded] = useState(false);

  useEffect(async () => {
    if (navigator.brave && (await navigator.brave.isBrave())) {
      setBrowser("Brave");
    } else if (isChrome) {
      setBrowser("Chrome");
    } else if (isEdge) {
      setBrowser("Edge");
    }
    setBrowserLoaded(true);
  }, []);

  const tech = [
    {
      title: "Machine Learning",
      for: "extracting trends from noisy data",
      icon: <MemoryRoundedIcon style={{ color: iconColor }} />,
    },
    {
      title: "Multivariate Statistics",
      for: "drawing inference from observation",
      icon: <AssessmentRoundedIcon style={{ color: iconColor }} />,
    },
    {
      title: "Distributed Data Streams",
      for: "up-to-date metrics, avaliable 24/7",
      icon: <StorageRoundedIcon style={{ color: iconColor }} />,
    },
    {
      title: "Chromium Compatability",
      for: "by-your-side assistance",
      icon: <ExtensionRoundedIcon style={{ color: iconColor }} />,
    },
    {
      title: "Technical Analysis",
      icon: <SpeedRoundedIcon style={{ color: iconColor }} />,
    },
    {
      title: "Comparative Studies",
      icon: <CompareArrowsRoundedIcon style={{ color: iconColor }} />,
    },
    {
      title: "Organized Downloads",
      icon: <GridOnRoundedIcon style={{ color: iconColor }} />,
    },
  ];

  return (
    <HeaderAndFooter overlayHeader={true}>
      <div className={styles.cover}>
        <Wave
          style={{
            height: 400,
          }}
          className="absoluteBottom"
          fill="url(#gradient)"
          paused={false}
          options={{
            height: 50,
            amplitude: 100,
            speed: 0.11,
            points: 5,
          }}
        >
          <defs>
            <linearGradient id="gradient" gradientTransform="rotate(90)">
              <stop offset="0%" stopColor="#ffffff40" />
              <stop offset="100%" stopColor="#ffffff00" />
            </linearGradient>
          </defs>
        </Wave>
        <Wave
          style={{
            height: 200,
          }}
          className={`absoluteBottom ${styles.flipX}`}
          fill="url(#gradient)"
          paused={false}
          options={{
            height: 40,
            amplitude: 80,
            speed: 0.1,
            points: 5,
          }}
        >
          <defs>
            <linearGradient id="gradient" gradientTransform="rotate(90)">
              <stop offset="0%" stopColor="#ffffff40" />
              <stop offset="100%" stopColor="#ffffff00" />
            </linearGradient>
          </defs>
        </Wave>
        <div
          className={`${styles.flexCenter} ${
            browserLoaded ? styles.browserFound : ""
          }`}
          style={{
            opacity: browserLoaded ? 1 : 0,
          }}
        >
          <h2>
            {`It's ${new Date().getFullYear()}. Meet your new `}
            <br />
            <span>
              Stock Investing
              <br />
              Assistant
            </span>
          </h2>
          {browser ? (
            <a
              href="dummyurl"
              className={styles.addButton}
            >{`Add to ${browser}`}</a>
          ) : null}
        </div>
        <div className={styles.spacer} />
        <div
          style={{
            backgroundColor:
              theme.palette.mode == "dark" ? "#000000a0" : "#ffffff70",
          }}
          className={styles.demo}
        >
          <ExtView
            name="Blake Sanie"
            args={["AAPL"]}
            currentTimeFrame={10}
            timeFrames={[10, 5, 1, "3mo"]}
            data={{
              1: {
                alpha: 0.2674787084290786,
                natr: 1.8337276881712474,
                drawdown: -0.18598864300536755,
                drawup: 0.5116577305641581,
                drawdown_z: 0.3298640489358899,
                p_z: 0.05965339654873913,
                beta_z: 0.7166083948401649,
                sharpe: 1.5023278930228507,
                natr_z: -0.7035880336427704,
                pr: -92.49781362888676,
                alpha_z: -0.031226947127613917,
                sharpe_z: 0.7096758052471124,
                p: 12.397700109799487,
                beta: 1.3345125249635543,
                pr_z: -0.06465054777376704,
                drawup_z: -0.12151409481300546,
                prophet: [
                  { days: 0, low: 175, mid: 175, high: 175 },
                  { days: 15, low: 158.6, mid: 164.1, high: 169.2 },
                  { days: 30, low: 159.6, mid: 165.5, high: 171 },
                  { days: 45, low: 161.4, mid: 166.7, high: 172.3 },
                  { days: 63, low: 164.8, mid: 170.2, high: 176.3 },
                  { days: 100, low: 165.7, mid: 171.5, high: 176.8 },
                  { days: 160, low: 173.6, mid: 179.9, high: 185.9 },
                  { days: 252, low: 189.1, mid: 196.8, high: 203.9 },
                ],
              },
              5: {
                alpha: 0.41201670694880543,
                beta: 1.227048447115621,
                drawdown_z: 0.7854095398505536,
                alpha_z: 1.2465535218814647,
                drawdown: -0.3851591208359212,
                natr_z: -0.6522904677032003,
                beta_z: 0.6454603867778232,
                pr: -60.71838672050489,
                sharpe: 1.4149268201296812,
                sharpe_z: 2.15009989888285,
                drawup_z: 0.09030624480874869,
                p: 84.65646000600975,
                pr_z: -0.08220792511872942,
                p_z: 0.22620450733035602,
                natr: 1.6495580818285167,
                drawup: 5.70095173131118,
                prophet: [
                  { days: 0, low: 175, mid: 175, high: 175 },
                  { days: 15, low: 158.6, mid: 164.1, high: 169.2 },
                  { days: 30, low: 159.6, mid: 165.5, high: 171 },
                  { days: 45, low: 161.4, mid: 166.7, high: 172.3 },
                  { days: 63, low: 164.8, mid: 170.2, high: 176.3 },
                  { days: 100, low: 165.7, mid: 171.5, high: 176.8 },
                  { days: 160, low: 173.6, mid: 179.9, high: 185.9 },
                  { days: 252, low: 189.1, mid: 196.8, high: 203.9 },
                  { days: 400, low: 202.4, mid: 213.9, high: 225.5 },
                  { days: 700, low: 229, mid: 253.3, high: 279.2 },
                  { days: 1260, low: 260.1, mid: 323.3, high: 387.1 },
                ],
              },
              10: {
                alpha: 0.2573126826989829,
                sharpe_z: 1.5635226581557178,
                drawdown: -0.4379716253776691,
                beta_z: 0.4242269412796086,
                beta: 1.158434600804775,
                drawup: 14.088923830825248,
                drawup_z: 0.35155224025342807,
                alpha_z: 1.1868973228018043,
                sharpe: 1.0892003427833266,
                drawdown_z: 0.5454437347209948,
                natr: 1.8001086593773166,
                pr_z: 0.016144765569757864,
                p_z: 0.25897909844445033,
                p: 180.22508926988422,
                natr_z: -0.5799529952251581,
                pr: -23.85692528418066,
                prophet: [
                  { days: 0, low: 175, mid: 175, high: 175 },
                  { days: 15, low: 158.6, mid: 164.1, high: 169.2 },
                  { days: 30, low: 159.6, mid: 165.5, high: 171 },
                  { days: 45, low: 161.4, mid: 166.7, high: 172.3 },
                  { days: 63, low: 164.8, mid: 170.2, high: 176.3 },
                  { days: 100, low: 165.7, mid: 171.5, high: 176.8 },
                  { days: 160, low: 173.6, mid: 179.9, high: 185.9 },
                  { days: 252, low: 189.1, mid: 196.8, high: 203.9 },
                  { days: 400, low: 202.4, mid: 213.9, high: 225.5 },
                  { days: 700, low: 229, mid: 253.3, high: 279.2 },
                  { days: 1260, low: 260.1, mid: 323.3, high: 387.1 },
                  { days: 1750, low: 284.1, mid: 390, high: 497.5 },
                  { days: 2520, low: 305.5, mid: 490.6, high: 679.1 },
                ],
              },
              global: {
                symbol: "AAPL",
                len: 2516,
                sector: "Technology",
                pattern: {},
                industry: "Computer Manufacturing",
                "market cap": "2563672465800.00",
                country: "United States",
                name: "Apple Inc. Common Stock",
                lastclose: 175.0800018310547,
                "ipo year": "1980",
              },
              "3mo": {
                drawdown: -0.06636243314087864,
                alpha_z: 0.005302267572051602,
                pr: -93.18731643257027,
                p: -2.786543286287994,
                sharpe: 3.2972483540205344,
                natr: 2.8984565758220873,
                pr_z: -0.39178586235148544,
                natr_z: -0.40414515763183984,
                sharpe_z: 1.6050590913592784,
                drawdown_z: 0.8578582350627589,
                drawup: 0.2601374570446735,
                p_z: -0.4505819940283351,
                alpha: 0.9160368541961843,
                drawup_z: 0.2979265689981348,
                beta: 0.9843708396512943,
                beta_z: -0.12427575676466493,
                prophet: [
                  { days: 0, low: 175, mid: 175, high: 175 },
                  { days: 15, low: 158.6, mid: 164.1, high: 169.2 },
                  { days: 30, low: 159.6, mid: 165.5, high: 171 },
                  { days: 45, low: 161.4, mid: 166.7, high: 172.3 },
                  { days: 63, low: 164.8, mid: 170.2, high: 176.3 },
                ],
              },
            }}
          />
          <p className={styles.demoDisclaimer}>
            Disclaimer: these visuals and figures are not updated nor live, and
            exist for demo purposes only.
          </p>
        </div>
      </div>
      <div className={`${styles.about} ${styles.flexCenter}`}>
        <h3>
          <span>Investivision</span> is a platform of modern consumer{" "}
          <span>investing tools</span>.
        </h3>
        <h3
          style={{
            marginTop: 40,
          }}
        >
          Our mission is to support your journey to{" "}
          <span>well calculated trades</span> with the help of{" "}
          <span>cutting-edge technologies</span>, <span>analysis methods</span>,
          and <span>interfaces</span> such as
        </h3>
        <div className={styles.techContainer}>
          {tech.map((element, i) => {
            return (
              <div className={styles.tech} key={i}>
                {element.icon}
                <p className={styles.techTitle}>{element.title}</p>
                {/* <p className={styles.techFor}>{`for ${element.for}`}</p> */}
              </div>
            );
          })}
        </div>
        <h3>While improving your existing experiences with</h3>
        <div className={styles.brokerages}>
          {otherServices.map((service, i) => {
            return <img src={`/images/${service}.png`} key={i} />;
          })}
        </div>
      </div>
    </HeaderAndFooter>
  );
}
