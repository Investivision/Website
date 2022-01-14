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
                "alpha%": 0.8545434154835907,
                alpha: 0.5144093622084491,
                "beta%": 0.8926816120499264,
                beta: 1.6816308227800139,
                "drawdown%": 0.6265302232900282,
                drawdown: -0.2519771021517144,
                "drawup%": 0.681819088581233,
                drawup: 0.7190259824019354,
                "natr%": 0.31619794235881726,
                natr: 2.6863968704380228,
                "p%": 0.6002115211126557,
                p: 18.28569324549818,
                pattern: { BELTHOLD: -100, ENGULFING: -100 },
                "pr%": 0.1335301280657385,
                pr: 6.638808108954847,
                res: 372.03,
                "sharpe%": 0.6792139188036648,
                sharpe: 1.1504709004331912,
                sup: 324.62,
                prophet: [
                  { days: 0, low: 353, mid: 353, high: 353 },
                  { days: 15, low: 337.2, mid: 347.5, high: 358.1 },
                  { days: 30, low: 342.9, mid: 353.6, high: 363.1 },
                  { days: 45, low: 346.8, mid: 357.4, high: 368 },
                  { days: 63, low: 345.5, mid: 355.2, high: 365.9 },
                  { days: 100, low: 355.8, mid: 367.5, high: 377.8 },
                  { days: 160, low: 374.4, mid: 385.7, high: 396.5 },
                  { days: 252, low: 403.2, mid: 417.5, high: 430.9 },
                ],
              },
              5: {
                "alpha%": 0.9801527346975383,
                alpha: 0.40192464935932914,
                "beta%": 0.591665528025529,
                beta: 1.1297223050137442,
                "drawdown%": 0.9148823331619054,
                drawdown: -0.3425056079446692,
                "drawup%": 0.8966551655596716,
                drawup: 5.305019275844046,
                "natr%": 0.256554191755361,
                natr: 1.9990460687102665,
                "p%": 0.6920791353223473,
                p: 97.80277689017188,
                pattern: {
                  ADVANCEBLOCK: -100,
                  DOJI: 100,
                  HIGHWAVE: 100,
                  LONGLEGGEDDOJI: 100,
                  RICKSHAWMAN: 100,
                  SPINNINGTOP: 100,
                },
                "pr%": 0.17964780075228792,
                pr: 37.684313975554176,
                res: 416.95,
                "sharpe%": 0.9969138422978603,
                sharpe: 1.3700412954497068,
                sup: 336.97,
                prophet: [
                  { days: 0, low: 353, mid: 353, high: 353 },
                  { days: 15, low: 337.2, mid: 347.5, high: 358.1 },
                  { days: 30, low: 342.9, mid: 353.6, high: 363.1 },
                  { days: 45, low: 346.8, mid: 357.4, high: 368 },
                  { days: 63, low: 345.5, mid: 355.2, high: 365.9 },
                  { days: 100, low: 355.8, mid: 367.5, high: 377.8 },
                  { days: 160, low: 374.4, mid: 385.7, high: 396.5 },
                  { days: 252, low: 403.2, mid: 417.5, high: 430.9 },
                  { days: 400, low: 433.5, mid: 458.9, high: 480.2 },
                  { days: 700, low: 487.4, mid: 542, high: 591.9 },
                  { days: 1260, low: 564.5, mid: 698.2, high: 827.6 },
                ],
              },
              10: {
                "alpha%": 0.9510285107425666,
                alpha: 0.2700490714785746,
                "beta%": 0.5365619171979822,
                beta: 1.06204562854978,
                "drawdown%": 0.9160084652087991,
                drawdown: -0.3425056079446692,
                "drawup%": 0.9803469506636021,
                drawup: 12.890162116163735,
                "natr%": 0.26699601600608347,
                natr: 1.9891155179356124,
                "p%": 0.7867721734782948,
                p: 199.92257494434062,
                pattern: { ADVANCEBLOCK: -100 },
                "pr%": 0.2012014472066006,
                pr: 73.07921889847503,
                res: 374.13,
                "sharpe%": 0.9944568043902325,
                sharpe: 1.1828462903450878,
                sup: 288.56,
                prophet: [
                  { days: 0, low: 353, mid: 353, high: 353 },
                  { days: 15, low: 337.2, mid: 347.5, high: 358.1 },
                  { days: 30, low: 342.9, mid: 353.6, high: 363.1 },
                  { days: 45, low: 346.8, mid: 357.4, high: 368 },
                  { days: 63, low: 345.5, mid: 355.2, high: 365.9 },
                  { days: 100, low: 355.8, mid: 367.5, high: 377.8 },
                  { days: 160, low: 374.4, mid: 385.7, high: 396.5 },
                  { days: 252, low: 403.2, mid: 417.5, high: 430.9 },
                  { days: 400, low: 433.5, mid: 458.9, high: 480.2 },
                  { days: 700, low: 487.4, mid: 542, high: 591.9 },
                  { days: 1260, low: 564.5, mid: 698.2, high: 827.6 },
                  { days: 1750, low: 621.4, mid: 838.4, high: 1046.7 },
                  { days: 2520, low: 662.6, mid: 1058.7, high: 1436.3 },
                ],
              },
              global: {
                country: "United States",
                industry: "EDP Services",
                "ipo year": "1992",
                lastclose: 352.989990234375,
                len: 2517,
                "market cap": "51905837351.00",
                name: "Synopsys Inc.",
                sector: "Technology",
                symbol: "SNPS",
                notes: "",
              },
              "3mo": {
                "alpha%": 0.9887305202914186,
                alpha: 1.2080144418136998,
                "beta%": 0.9031003979469923,
                beta: 1.8566192195826345,
                "drawdown%": 0.8401232896183479,
                drawdown: -0.06481355333384597,
                "drawup%": 0.8348223220240247,
                drawup: 0.30078966904798343,
                "natr%": 0.32953803574893836,
                natr: 2.691730043145857,
                "p%": 0.46582409459829677,
                p: 0.6378426396527033,
                pattern: {},
                "pr%": 0.13567614931153155,
                pr: 5.738830801154396,
                res: 363.27,
                "sharpe%": 0.8990307836667281,
                sharpe: 2.628294611980286,
                sup: 348.68,
                prophet: [
                  { days: 0, low: 353, mid: 353, high: 353 },
                  { days: 15, low: 337.2, mid: 347.5, high: 358.1 },
                  { days: 30, low: 342.9, mid: 353.6, high: 363.1 },
                  { days: 45, low: 346.8, mid: 357.4, high: 368 },
                  { days: 63, low: 345.5, mid: 355.2, high: 365.9 },
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
