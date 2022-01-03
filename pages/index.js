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
            name="Blake Sanie"
            args={["AMD"]}
            currentTimeFrame={10}
            timeFrames={[10, 5, 1, "3mo"]}
            data={{
              1: {
                natr_z: 0.38252234357656634,
                sharpe_z: 0.6188525499831528,
                p: 7.0408622268222985,
                p_z: -0.240022191135156,
                beta_z: 1.2381697458301941,
                alpha_z: 1.8661372724569132,
                drawdown_z: 0.3390934155730485,
                alpha: 0.8433244759562748,
                pr_z: -0.9066829650660473,
                res: 155.34,
                drawup_z: 1.8860577804250378,
                drawdown: -0.24843191426333544,
                sup: 122.22,
                drawup: 1.2152142806740507,
                sharpe: 1.2707914209199764,
                pattern: {
                  CDLMARUBOZU: -100,
                  CDLDARKCLOUDCOVER: -100,
                  CDLBELTHOLD: -100,
                  CDLCLOSINGMARUBOZU: -100,
                  CDLLONGLINE: -100,
                },
                beta: 1.6702708846127328,
                pr: 10.158983657232707,
                natr: 4.460724688360863,
                prophet: [
                  { days: 0, low: 144, mid: 144, high: 144 },
                  { days: 15, low: 117.9, mid: 124.7, high: 131.8 },
                  { days: 30, low: 119.1, mid: 126.4, high: 133.2 },
                  { days: 45, low: 123.2, mid: 130, high: 137.3 },
                  { days: 63, low: 122.6, mid: 129.9, high: 137.1 },
                  { days: 100, low: 124.9, mid: 132.1, high: 139 },
                  { days: 160, low: 132, mid: 139.6, high: 146.3 },
                  { days: 252, low: 146.3, mid: 154, high: 162 },
                ],
              },
              5: {
                sharpe: 1.1780712426504147,
                sharpe_z: 2.077430766945844,
                drawdown: -0.4911369499584487,
                beta: 1.4867905829700085,
                sup: 141.16,
                drawdown_z: 0.5647096623855649,
                drawup: 15.98950768088115,
                pr: 19.25792973405643,
                pattern: {},
                natr: 2.8091465904772814,
                p: 83.27202428547093,
                alpha_z: 4.1909405689909525,
                alpha: 0.7394441950450821,
                p_z: 0.2408632670914329,
                pr_z: -1.1561173429632015,
                res: 183.1,
                beta_z: 1.3421977737815622,
                drawup_z: 6.538293975282982,
                natr_z: -0.10863950999416859,
                prophet: [
                  { days: 0, low: 144, mid: 144, high: 144 },
                  { days: 15, low: 117.9, mid: 124.7, high: 131.8 },
                  { days: 30, low: 119.1, mid: 126.4, high: 133.2 },
                  { days: 45, low: 123.2, mid: 130, high: 137.3 },
                  { days: 63, low: 122.6, mid: 129.9, high: 137.1 },
                  { days: 100, low: 124.9, mid: 132.1, high: 139 },
                  { days: 160, low: 132, mid: 139.6, high: 146.3 },
                  { days: 252, low: 146.3, mid: 154, high: 162 },
                  { days: 400, low: 159.8, mid: 168.5, high: 176.9 },
                  { days: 700, low: 194.1, mid: 206.7, high: 219 },
                  { days: 1260, low: 238.8, mid: 263.7, high: 289.6 },
                ],
              },
              10: {
                sharpe: 0.851283816461409,
                drawdown: -0.8036363630583792,
                sup: 121.62,
                natr_z: -0.17451265783319203,
                alpha_z: 3.6512431083874684,
                sharpe_z: 1.2205648627436212,
                drawup: 98.94444641082538,
                pattern: { CDLBELTHOLD: 100 },
                pr: 36.00026461044159,
                p_z: 0.6433369313016952,
                pr_z: -1.0621562297039209,
                drawup_z: 24.803565873765272,
                alpha: 0.4886350236770731,
                beta: 1.5314597525480744,
                res: 152.8,
                natr: 2.5401412424741276,
                drawdown_z: -0.9479346854473678,
                p: 186.44129116767817,
                beta_z: 1.5887944577590156,
                prophet: [
                  { days: 0, low: 144, mid: 144, high: 144 },
                  { days: 15, low: 117.9, mid: 124.7, high: 131.8 },
                  { days: 30, low: 119.1, mid: 126.4, high: 133.2 },
                  { days: 45, low: 123.2, mid: 130, high: 137.3 },
                  { days: 63, low: 122.6, mid: 129.9, high: 137.1 },
                  { days: 100, low: 124.9, mid: 132.1, high: 139 },
                  { days: 160, low: 132, mid: 139.6, high: 146.3 },
                  { days: 252, low: 146.3, mid: 154, high: 162 },
                  { days: 400, low: 159.8, mid: 168.5, high: 176.9 },
                  { days: 700, low: 194.1, mid: 206.7, high: 219 },
                  { days: 1260, low: 238.8, mid: 263.7, high: 289.6 },
                  { days: 1750, low: 278.4, mid: 321.7, high: 362.1 },
                  { days: 2520, low: 336.8, mid: 412.2, high: 485.2 },
                ],
              },
              global: {
                "ipo year": "",
                len: 2517,
                sector: "Technology",
                "market cap": "176323202535.00",
                symbol: "AMD",
                lastclose: 143.89999389648438,
                name: "Advanced Micro Devices Inc. Common Stock",
                industry: "Semiconductors",
                country: "United States",
                notes: "",
              },
              "3mo": {
                sharpe_z: 1.3679143213044063,
                drawup: 0.5467138248957755,
                alpha: 2.7414099631215625,
                sup: 124.67,
                pr: 11.110401474833216,
                p: -9.735962088906177,
                beta_z: 1.894173308141809,
                drawdown_z: 0.18825741816410801,
                alpha_z: 4.812487048576866,
                pattern: {},
                sharpe: 2.882673008524739,
                beta: 2.2320205343001516,
                res: 144.57,
                natr_z: 0.5647387871942172,
                drawup_z: 3.179812003399423,
                natr: 4.814239100919843,
                drawdown: -0.17361497112318292,
                p_z: -0.7381559885393335,
                pr_z: -0.6952823446640441,
                prophet: [
                  { days: 0, low: 144, mid: 144, high: 144 },
                  { days: 15, low: 117.9, mid: 124.7, high: 131.8 },
                  { days: 30, low: 119.1, mid: 126.4, high: 133.2 },
                  { days: 45, low: 123.2, mid: 130, high: 137.3 },
                  { days: 63, low: 122.6, mid: 129.9, high: 137.1 },
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
            <Link href="/library">
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
