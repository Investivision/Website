import HeaderAndFooter from "../components/HeaderAndFooter";
import styles from "./index.module.css";
import Wave from "react-wavify";
import { isChrome, isEdge } from "react-device-detect";
import { useState, useEffect, useMemo } from "react";
import ExtensionRoundedIcon from "@material-ui/icons/ExtensionRounded";
import GridOnRoundedIcon from "@material-ui/icons/GridOnRounded";
import { useTheme } from "@mui/material/styles";
import ExtView from "./ext";
import Link from "next/link";
import Button from "@mui/material/Button";
import TwitterCarousel from "../components/TwitterCoursel";

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
        {browserLoaded && (
          <>
            <div className={`${styles.flexCenter} ${styles.meet}`}>
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
                  args: ["NVDA"],
                  insights: {
                    NVDA: {
                      notes: "",
                      "alpha%_3mo": 0.198852410551572,
                      "drawdown%_3mo": 0.2524772468537568,
                      p45: [263.2, 276.6, 290.4],
                      pattern_3mo: {},
                      sup_3mo: -0.12211951121180079,
                      p_5: 167.709363998159,
                      drawdown_3mo: -0.3232799522741088,
                      beta_10: 1.5170678693131916,
                      sector: "Technology",
                      adx_1: 32.01888050111412,
                      "p%_3mo": 0.6716794087956137,
                      alpha_10: 0.6368108835458466,
                      "beta%_10": 0.9409183864569415,
                      p_10: 319.47273982881484,
                      sup_10: -0.15576718428243466,
                      "p%_10": 0.9226646881593072,
                      "pr%_10": 0.14206651614587573,
                      "alpha%_1": 0.9998122691755946,
                      "beta%_3mo": 0.9872907623393252,
                      natr_5: 4.394430153405667,
                      rsi_5: 43.23438712425556,
                      p100: [280.7, 294.8, 308.2],
                      len: 2516,
                      "natr%_5": 0.7930308561383937,
                      p700: [422.8, 463.7, 502.5],
                      pr_1: 9.280802720586454,
                      "drawup%_1": 0.9999998863832141,
                      beta_1: 2.360095661938771,
                      p63: [266.7, 281.2, 295.7],
                      "sharpe%_1": 0.9133680119246541,
                      sup_1: -0.1049047673145822,
                      pr_5: 29.45710490710444,
                      pr_10: 53.94774521225495,
                      alpha_1: 1.306558970523533,
                      drawdown_10: -0.5603844986717537,
                      res_5: 0.03303499387855531,
                      "drawup%_5": 0.9999998518665167,
                      drawup_10: 126.69312478327731,
                      "alpha%_5": 0.995783260458713,
                      industry: "Semiconductors",
                      "pr%_1": 0.17165388437521495,
                      rsi_1: 39.669112537203276,
                      res_3mo: 0.045491299916605395,
                      adx_10: 10.224200552540339,
                      name: "NVIDIA Corporation",
                      beta_3mo: 2.733487422724532,
                      rsi_3mo: 36.92906032747091,
                      natr_10: 3.251859857142716,
                      natr_1: 6.631083848442473,
                      "alpha%_10": 0.9999996975007784,
                      p15: [251.9, 266.3, 280.6],
                      beta_5: 1.6595885756740338,
                      sharpe_1: 1.4039550170186348,
                      alpha_3mo: -0.7165338624535209,
                      "pr%_5": 0.1441989397126937,
                      lastclose: 234.77000427246094,
                      "market cap": 759750000000.0,
                      adx_5: 16.40797539695451,
                      "beta%_5": 0.9710609814773935,
                      drawup_5: 13.14562842822303,
                      pr_3mo: 10.317546889002537,
                      sharpe_3mo: -1.7827240239362854,
                      p400: [356.7, 377.7, 398.8],
                      symbol: "NVDA",
                      rsi_10: 50.755407199401425,
                      sup_5: -0.13727308400025484,
                      "sharpe%_10": 0.9989929533975896,
                      "pr%_3mo": 0.24058667825763086,
                      adx_3mo: 46.213021341880896,
                      pattern_1: { BELTHOLD: 100, THRUSTING: -100 },
                      sharpe_5: 1.1767060567916627,
                      "beta%_1": 0.9928670255034229,
                      "drawup%_3mo": 0.5538726976239943,
                      sharpe_10: 1.2219955773109723,
                      pattern_5: { SPINNINGTOP: -100 },
                      "drawdown%_1": 0.5247093587031895,
                      caprank: 8.0,
                      "natr%_3mo": 0.8222905170550212,
                      res_10: 0.12924946408019664,
                      "natr%_1": 0.8419561544506229,
                      "sharpe%_3mo": 0.2322936577822523,
                      p2520: [724.8, 984.8, 1256.0],
                      p_3mo: 19.765598681741466,
                      "p%_1": 0.8046493803622204,
                      p30: [256.3, 271.4, 284.6],
                      res_1: 0.1853496711320506,
                      p1260: [535.9, 628.5, 721.0],
                      drawdown_1: -0.3424410777967042,
                      "natr%_10": 0.5945296751968866,
                      natr_3mo: 6.959020302176924,
                      pattern_10: { ENGULFING: -100 },
                      p160: [299.1, 313.0, 327.9],
                      p_1: 47.451625894365606,
                      p1750: [620.2, 771.4, 928.4],
                      "p%_5": 0.8888895311257533,
                      drawup_3mo: 0.21696128701181117,
                      "drawdown%_10": 0.6113833264260273,
                      "sharpe%_5": 0.9945955569534879,
                      "drawup%_10": 1.0,
                      drawdown_5: -0.5603844986717537,
                      p252: [330.5, 346.2, 362.6],
                      alpha_5: 0.4922847122545826,
                      "drawdown%_5": 0.5841093452046696,
                      drawup_1: 1.8810782595064168,
                    },
                  },
                  name: "Blake Sanie",
                }}
              />
              <p className={styles.demoDisclaimer}>
                Disclaimer: these visuals and figures are not updated nor live,
                and exist for demo purposes only.
              </p>
            </div>
          </>
        )}
        {/* <div
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
              args: ["NVDA"],
              insights: {
                NVDA: {
                  notes: "",
                  "alpha%_3mo": 0.198852410551572,
                  "drawdown%_3mo": 0.2524772468537568,
                  p45: [263.2, 276.6, 290.4],
                  pattern_3mo: {},
                  sup_3mo: -0.12211951121180079,
                  p_5: 167.709363998159,
                  drawdown_3mo: -0.3232799522741088,
                  beta_10: 1.5170678693131916,
                  sector: "Technology",
                  adx_1: 32.01888050111412,
                  "p%_3mo": 0.6716794087956137,
                  alpha_10: 0.6368108835458466,
                  "beta%_10": 0.9409183864569415,
                  p_10: 319.47273982881484,
                  sup_10: -0.15576718428243466,
                  "p%_10": 0.9226646881593072,
                  "pr%_10": 0.14206651614587573,
                  "alpha%_1": 0.9998122691755946,
                  "beta%_3mo": 0.9872907623393252,
                  natr_5: 4.394430153405667,
                  rsi_5: 43.23438712425556,
                  p100: [280.7, 294.8, 308.2],
                  len: 2516,
                  "natr%_5": 0.7930308561383937,
                  p700: [422.8, 463.7, 502.5],
                  pr_1: 9.280802720586454,
                  "drawup%_1": 0.9999998863832141,
                  beta_1: 2.360095661938771,
                  p63: [266.7, 281.2, 295.7],
                  "sharpe%_1": 0.9133680119246541,
                  sup_1: -0.1049047673145822,
                  pr_5: 29.45710490710444,
                  pr_10: 53.94774521225495,
                  alpha_1: 1.306558970523533,
                  drawdown_10: -0.5603844986717537,
                  res_5: 0.03303499387855531,
                  "drawup%_5": 0.9999998518665167,
                  drawup_10: 126.69312478327731,
                  "alpha%_5": 0.995783260458713,
                  industry: "Semiconductors",
                  "pr%_1": 0.17165388437521495,
                  rsi_1: 39.669112537203276,
                  res_3mo: 0.045491299916605395,
                  adx_10: 10.224200552540339,
                  name: "NVIDIA Corporation",
                  beta_3mo: 2.733487422724532,
                  rsi_3mo: 36.92906032747091,
                  natr_10: 3.251859857142716,
                  natr_1: 6.631083848442473,
                  "alpha%_10": 0.9999996975007784,
                  p15: [251.9, 266.3, 280.6],
                  beta_5: 1.6595885756740338,
                  sharpe_1: 1.4039550170186348,
                  alpha_3mo: -0.7165338624535209,
                  "pr%_5": 0.1441989397126937,
                  lastclose: 234.77000427246094,
                  "market cap": 759750000000.0,
                  adx_5: 16.40797539695451,
                  "beta%_5": 0.9710609814773935,
                  drawup_5: 13.14562842822303,
                  pr_3mo: 10.317546889002537,
                  sharpe_3mo: -1.7827240239362854,
                  p400: [356.7, 377.7, 398.8],
                  symbol: "NVDA",
                  rsi_10: 50.755407199401425,
                  sup_5: -0.13727308400025484,
                  "sharpe%_10": 0.9989929533975896,
                  "pr%_3mo": 0.24058667825763086,
                  adx_3mo: 46.213021341880896,
                  pattern_1: { BELTHOLD: 100, THRUSTING: -100 },
                  sharpe_5: 1.1767060567916627,
                  "beta%_1": 0.9928670255034229,
                  "drawup%_3mo": 0.5538726976239943,
                  sharpe_10: 1.2219955773109723,
                  pattern_5: { SPINNINGTOP: -100 },
                  "drawdown%_1": 0.5247093587031895,
                  caprank: 8.0,
                  "natr%_3mo": 0.8222905170550212,
                  res_10: 0.12924946408019664,
                  "natr%_1": 0.8419561544506229,
                  "sharpe%_3mo": 0.2322936577822523,
                  p2520: [724.8, 984.8, 1256.0],
                  p_3mo: 19.765598681741466,
                  "p%_1": 0.8046493803622204,
                  p30: [256.3, 271.4, 284.6],
                  res_1: 0.1853496711320506,
                  p1260: [535.9, 628.5, 721.0],
                  drawdown_1: -0.3424410777967042,
                  "natr%_10": 0.5945296751968866,
                  natr_3mo: 6.959020302176924,
                  pattern_10: { ENGULFING: -100 },
                  p160: [299.1, 313.0, 327.9],
                  p_1: 47.451625894365606,
                  p1750: [620.2, 771.4, 928.4],
                  "p%_5": 0.8888895311257533,
                  drawup_3mo: 0.21696128701181117,
                  "drawdown%_10": 0.6113833264260273,
                  "sharpe%_5": 0.9945955569534879,
                  "drawup%_10": 1.0,
                  drawdown_5: -0.5603844986717537,
                  p252: [330.5, 346.2, 362.6],
                  alpha_5: 0.4922847122545826,
                  "drawdown%_5": 0.5841093452046696,
                  drawup_1: 1.8810782595064168,
                },
              },
              name: "Blake Sanie",
            }}
          />
          <p className={styles.demoDisclaimer}>
            Disclaimer: these visuals and figures are not updated nor live, and
            exist for demo purposes only.
          </p>
        </div> */}
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
            <p className={styles.offeringTitle}>Insight Screener</p>
            <p className={styles.offeringCaption}>
              The ultimate workbench for stock discovery, evaluation, and
              comparison.
            </p>
            <Link href="/screener">
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
        <h4>Insight Coverage</h4>
        <h3>
          We investigate on every core aspect of stock evaluation,
          <br />
          from growth, to risk, to pivot studies, to AI forecasting
        </h3>
        <TwitterCarousel />
      </div>
    </HeaderAndFooter>
  );
}
