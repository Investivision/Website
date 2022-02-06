import HeaderAndFooter from "../components/HeaderAndFooter";
import styles from "./index.module.css";
import Wave from "react-wavify";
import { isChrome, isEdge } from "react-device-detect";
import { useState, useEffect } from "react";
import ExtensionRoundedIcon from "@material-ui/icons/ExtensionRounded";
import GridOnRoundedIcon from "@material-ui/icons/GridOnRounded";
import { useTheme } from "@mui/material/styles";
import ExtView from "./ext";
import Link from "next/link";
import Button from "@mui/material/Button";

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

  return (
    <HeaderAndFooter overlayHeader={true}>
      <div className={styles.cover}>
        <Wave
          style={{
            height: "40%",
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
            height: "70%",
          }}
          className={`absoluteBottom ${styles.flipX}`}
          fill="url(#gradient)"
          paused={false}
          options={{
            height: 60,
            amplitude: 120,
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
              theme.palette.mode == "dark" ? "#000000a0" : "#ffffffa0",
          }}
          className={styles.demo}
        >
          <ExtView
            data={{
              args: ["AAPL"],
              insights: {
                AAPL: {
                  "sharpe%_5": 0.9976750582747892,
                  pattern_3mo: {
                    SPINNINGTOP: 100,
                  },
                  industry: "Computer Manufacturing",
                  natr_10: 1.9691343547812812,
                  res_1: 0.12023783742534892,
                  p400: [207.2, 217.6, 227.1],
                  p1750: [320, 403.2, 484.8],
                  "natr%_1": 0.2458822684611227,
                  "p%_1": 0.4901789859805299,
                  "drawup%_5": 0.8699805277875359,
                  "market cap": 2563672465800,
                  p_1: 18.556682167248056,
                  p15: [163, 168.7, 174.2],
                  "beta%_1": 0.7006281580352542,
                  "alpha%_5": 0.9849552372468409,
                  sharpe_3mo: 2.0367436341374368,
                  "pr%_3mo": 0.16360646638287502,
                  drawdown_10: -0.43797154075337197,
                  "natr%_10": 0.2278034130282489,
                  sup_5: -0.04301459544173354,
                  "drawdown%_10": 0.8151839474027686,
                  "beta%_3mo": 0.6167822954617433,
                  p1260: [288.6, 337.4, 387.1],
                  natr_5: 1.8280247209944014,
                  p2520: [362.1, 506.8, 641.7],
                  "sharpe%_1": 0.8007781281813207,
                  "p%_3mo": 0.4114999115847453,
                  p700: [242.4, 264.7, 285.2],
                  p63: [170.1, 176.2, 182.1],
                  "alpha%_1": 0.8643994117343247,
                  alpha_10: 0.2636841680105051,
                  natr_1: 2.615429033241645,
                  p100: [172, 177.9, 183.8],
                  res_5: 0.1618358930611159,
                  sharpe_10: 1.0134509038052457,
                  symbol: "AAPL",
                  p30: [162.4, 168.9, 174.5],
                  p_3mo: 2.2118350910866837,
                  "alpha%_3mo": 0.9316122273176037,
                  natr_3mo: 3.0970008155671422,
                  "beta%_10": 0.6673046921223105,
                  "sharpe%_10": 0.9845666323065906,
                  "drawup%_10": 0.9913220535230689,
                  "natr%_3mo": 0.23283545558057606,
                  p_10: 193.95871241299136,
                  pattern_10: {
                    SPINNINGTOP: -100,
                    RICKSHAWMAN: 100,
                    HIGHWAVE: -100,
                    LONGLEGGEDDOJI: 100,
                    HARAMICROSS: -100,
                    HARAMI: -100,
                    DOJI: 100,
                  },
                  sharpe_5: 1.2890540274183246,
                  drawup_10: 13.99924920523641,
                  alpha_1: 0.44179356067178666,
                  "natr%_5": 0.18570757204285365,
                  pattern_5: {
                    HIGHWAVE: -100,
                    SPINNINGTOP: -100,
                    MATCHINGLOW: 100,
                    LONGLEGGEDDOJI: 100,
                    DOJI: 100,
                  },
                  p_5: 95.69096881813059,
                  "drawdown%_3mo": 0.766985987822197,
                  res_10: 0.26358125732220405,
                  p252: [197.2, 204.4, 211.1],
                  res_3mo: 0.020414312718036162,
                  "drawdown%_1": 0.8225335491599542,
                  "pr%_5": 0.14638787128460345,
                  "pr%_10": 0.16011662197860088,
                  sup_10: -0.039979279328579045,
                  "drawdown%_5": 0.8755264988837468,
                  alpha_5: 0.4207200970224403,
                  name: "Apple Inc.",
                  drawup_3mo: 0.23087847395824768,
                  pr_1: 6.7744885410572735,
                  beta_1: 1.3600752950488275,
                  pr_10: 55.18080529485443,
                  drawup_5: 4.936418609926908,
                  p45: [167.4, 173.2, 178.9],
                  "p%_5": 0.5777518000933706,
                  pr_3mo: 6.768312279301576,
                  drawdown_3mo: -0.12521282370755582,
                  pr_5: 29.197704834520298,
                  "sharpe%_3mo": 0.9645594292122305,
                  alpha_3mo: 0.509532806166755,
                  len: 2518,
                  beta_5: 1.2353208653329808,
                  sector: "Technology",
                  "drawup%_1": 0.6125254524382386,
                  beta_10: 1.1661347760372311,
                  sup_1: -0.03993672355988773,
                  "pr%_1": 0.13427995939853582,
                  p160: [185.6, 191.3, 197.2],
                  drawup_1: 0.5714919936615457,
                  lastclose: 172.38999938964844,
                  drawdown_1: -0.1500986992462936,
                  "alpha%_10": 0.9444780037888705,
                  pattern_1: {
                    SHORTLINE: -100,
                    HARAMI: -100,
                    SPINNINGTOP: -100,
                  },
                  drawdown_5: -0.38515915921106747,
                  beta_3mo: 1.257087190027478,
                  "p%_10": 0.6616947195658933,
                  sharpe_1: 1.083435682916223,
                  "drawup%_3mo": 0.734458569438466,
                  sup_3mo: -0.019656832823423745,
                  "beta%_5": 0.7159949595041694,
                  notes: "",
                },
              },
              name: "Blake Sanie",
            }}
          />
          <p className={styles.demoDisclaimer}>
            Disclaimer: these visuals and figures are not updated nor live, and
            exist for demo purposes only.
          </p>
        </div>
      </div>
      <div className={`${styles.about} ${styles.flexCenter}`}>
        <h4>Who are we?</h4>
        <h3>
          {/* <img
            src="/images/logo.svg"
            style={{
              width: 30,
              backgroundColor: "rgb(255,255,255,1)",
              padding: 3,
              borderRadius: 8,
              verticalAlign: "middle",
              margin: "0 4px",
              marginTop: -2,
            }}
          /> */}
          <span>Investivision</span> is the world's sleekest platform of stock
          investing research tools.
        </h3>
        <h3>
          We deliver insightful, unopinionated, data-driven{" "}
          <span>stock evaluation metrics</span> at your fingertips. In other
          words, your stock report-card.
        </h3>
        <h3>
          Backed by <span>multivariate statistics</span> and groundbreaking{" "}
          <span>machine learning</span> methods, Investivision's concrete
          insights stand out{" "}
          <span>against today's speculative writers and analysts</span>.
        </h3>
        <h4>This is a brokerage, right?</h4>
        <h3>
          <span>We are not a brokerage</span>, nor do we aim to replace your
          current trading workflow. Instead, we specialize in unique
          quantitative market research designed for you to{" "}
          <span>utilize alongside your current setup</span>, including
        </h3>
        <div className={styles.brokers}>
          <img src="/images/etrade.png" width={130} />
          <img src="/images/finviz.png" width={90} />
          <img src="/images/robinhood.png" width={140} />
          <img src="/images/td.png" width={150} />
          <img src="/images/tradingview.png" width={150} />
        </div>
        <h4>Get Started</h4>
        <h3>Explore our essential offerings</h3>
        <div className={styles.offerings}>
          <div>
            <ExtensionRoundedIcon />
            <p className={styles.offeringTitle}>Chrome Extension</p>
            <p className={styles.offeringCaption}>
              Our powerful by-your-side trading research copilot. Download Now.
            </p>
            <Link href="/extension">
              <Button
                color="white"
                variant="contained"
                sx={{
                  color: theme.palette.primary.main + " !important",
                  backgroundColor: "rgba(255,255,255,0.8)",
                }}
              >
                Get Started
              </Button>
            </Link>
          </div>
          <div>
            <GridOnRoundedIcon />
            <p className={styles.offeringTitle}>Insight Library</p>
            <p className={styles.offeringCaption}>
              The ultimate workbench for stock discovery, evaluation, and
              comparison.
            </p>
            <Link href="/insights">
              <Button
                variant="contained"
                color="white"
                sx={{
                  color: theme.palette.primary.main + " !important",
                  backgroundColor: "rgba(255,255,255,0.8)",
                }}
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </HeaderAndFooter>
  );
}
