import { useRouter } from "next/router";
import Growth from "../../components/ext/Growth";
import Risk from "../../components/ext/Risk";
import Candle from "../../components/ext/Candle";
import Prophet from "../../components/ext/Prophet";
import Momentum from "../../components/ext/Momentum";
import Pivots from "../../components/ext/Pivots";
import { useTheme } from "@mui/styles";
import { useLayoutEffect, useState, useRef, useEffect } from "react";
import { processSymbolData } from "../ext";
import { useContext } from "react";
import { DarkTheme } from "../Theme";

const getTodaysDate = () => {
  const now = new Date();
  return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
};

const CONTENT_WIDTH = 420;

const termMap = {
  1: "1yr",
  5: "5yr",
  10: "10yr",
  "3mo": "3mo",
};

const timeframeMap = {
  1: "Short-term",
  5: "Med-term",
  10: "Long-term",
  "3mo": "Swing Trade",
};

export default function TwitterImage(props) {
  const router = useRouter();
  const theme = useTheme();

  const [height, setHeight] = useState(undefined);

  useLayoutEffect(() => {
    const el = document.getElementById("content");
    if (el) {
      setHeight((el.clientHeight / CONTENT_WIDTH) * width);
    }
  });

  let { data, section, timeframe, width = "420" } = router.query;

  const enforceDarkTheme = useContext(DarkTheme);
  enforceDarkTheme();

  if (!data) {
    return null;
  }

  data = JSON.parse(data);
  data = processSymbolData(data);

  const global = data.global;
  data = data[timeframe];

  width = parseInt(width);

  const getComponent = () => {
    if (section == "Growth") return <Growth data={data} global={global} />;
    if (section == "Risk") return <Risk data={data} global={global} />;
    if (section == "Candle Patterns")
      return (
        <Candle
          data={data}
          global={global}
          style={{
            transform: "scale(1.2)",
            margin: "10px 0",
          }}
        />
      );
    if (section == "AI Forecast")
      return (
        <div
          style={{
            width: 320,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            transform: "scale(1.2)",
            margin: 24,
          }}
        >
          <Prophet
            data={data}
            global={global}
            plotStyles={{
              height: 140,
            }}
          />
        </div>
      );
    if (section == "Momentum")
      return (
        <div
          style={{
            transform: "scale(1.4)",
            margin: "14px 0",
            display: "flex",
          }}
        >
          <Momentum data={data} global={global} />
        </div>
      );
    if (section == "Pivot Points")
      return (
        <div
          style={{
            width: 300,
            transform: "scale(1.3)",
            margin: 14,
          }}
        >
          <Pivots sup={data.sup} res={data.res} lastClose={global.lastclose} />
        </div>
      );
  };

  return (
    <div
      style={{
        // border: `1px solid red`,
        height: height || "auto",
      }}
    >
      <div
        id="content"
        style={{
          width: CONTENT_WIDTH,
          padding: 30,
          //   border: `1px solid white`,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          fontSize: 16,
          transform: `scale(${width / CONTENT_WIDTH})`,
          transformOrigin: "left top",
        }}
      >
        <h1
          style={{
            fontSize: 34,
          }}
        >
          {global.symbol}
        </h1>
        {/* <h2
          style={{
            fontSize: 17,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
            marginTop: -6,
            marginBottom: 10,
            opacity: 0.5,
          }}
        >
          {global.name}
        </h2> */}
        <h2
          style={{
            fontSize: 20,
            color: theme.palette.secondary.main,
          }}
        >
          {`${section}${
            section == "AI Forecast"
              ? ` for next ${termMap[timeframe]}`
              : `, ${timeframeMap[timeframe]} (${termMap[timeframe]})`
          } `}
        </h2>
        <h2
          style={{
            fontSize: 17,
            color: theme.palette.secondary.main,
            marginBottom: 24,
            opacity: 0.5,
          }}
        >
          {`
        ${getTodaysDate()}`}
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {getComponent()}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            marginTop: 26,
          }}
        >
          <h2
            style={{
              fontSize: 17,
              color: theme.palette.secondary.main,
            }}
          >
            More on
          </h2>
          <img
            src="/images/dark_logo.svg"
            style={{
              width: 40,
              backgroundColor: "black",
              padding: 8,
              borderRadius: 9,
              boxShadow: "0 0 20px 0 rgba(255,255,255,0.2)",
            }}
          />
          <h2
            style={{
              fontSize: 17,
              color: theme.palette.secondary.main,
            }}
          >
            Investivision.com
          </h2>
        </div>
      </div>
    </div>
  );
}
// localhost:3000/twitterImage?data=%7B%221%22%3A%7B%22alpha%22%3A0.4662446343723152%2C%22beta%22%3A1.325672383104089%2C%22drawup%22%3A0.5714919936615457%2C%22sharpe%22%3A1.381159998482135%2C%22natr%22%3A2.826008859024919%2C%22sup%22%3A-0.09296235445448806%2C%22res%22%3A0.005227193236990997%2C%22pattern%22%3A%7B%22DOJI%22%3A100%2C%22HIGHWAVE%22%3A-100%2C%22LONGLEGGEDDOJI%22%3A100%2C%22SPINNINGTOP%22%3A-100%7D%2C%22rsi%22%3A42.82396077615316%2C%22adx%22%3A23.19934310314466%2C%22drawdown%22%3A-0.1252128237075558%2C%22p%22%3A25.17478011320962%2C%22pr%22%3A7.103900218888905%2C%22alpha%25%22%3A0.9008717255874927%2C%22beta%25%22%3A0.6832541403134196%2C%22drawup%25%22%3A0.6429767013894817%2C%22sharpe%25%22%3A0.8871733349686316%2C%22natr%25%22%3A0.2660969906378579%2C%22drawdown%25%22%3A0.8620576117365486%2C%22p%25%22%3A0.5844617783028907%2C%22pr%25%22%3A0.1397797636520813%2C%22prophet%22%3A%5B%7B%22days%22%3A0%2C%22low%22%3A165%2C%22mid%22%3A165%2C%22high%22%3A165%7D%2C%7B%22days%22%3A15%2C%22low%22%3A163.7%2C%22mid%22%3A169.5%2C%22high%22%3A175.1%7D%2C%7B%22days%22%3A30%2C%22low%22%3A165.4%2C%22mid%22%3A171.2%2C%22high%22%3A177.1%7D%2C%7B%22days%22%3A45%2C%22low%22%3A170.7%2C%22mid%22%3A176.5%2C%22high%22%3A182.2%7D%2C%7B%22days%22%3A63%2C%22low%22%3A173.7%2C%22mid%22%3A179.1%2C%22high%22%3A184.7%7D%2C%7B%22days%22%3A100%2C%22low%22%3A175.4%2C%22mid%22%3A181%2C%22high%22%3A186.9%7D%2C%7B%22days%22%3A160%2C%22low%22%3A187.9%2C%22mid%22%3A194.5%2C%22high%22%3A200.3%7D%2C%7B%22days%22%3A252%2C%22low%22%3A198.9%2C%22mid%22%3A206.4%2C%22high%22%3A213.6%7D%5D%7D%2C%225%22%3A%7B%22alpha%22%3A0.4243988038060955%2C%22beta%22%3A1.23358654972825%2C%22drawup%22%3A4.624166341407971%2C%22sharpe%22%3A1.216111887900956%2C%22natr%22%3A1.979569326923248%2C%22sup%22%3A-0.01909672063317506%2C%22res%22%3A0.2050499283110412%2C%22pattern%22%3A%7B%22DOJI%22%3A100%2C%22HARAMI%22%3A100%2C%22HARAMICROSS%22%3A100%2C%22HIGHWAVE%22%3A-100%2C%22HOMINGPIGEON%22%3A100%2C%22LONGLEGGEDDOJI%22%3A100%2C%22RICKSHAWMAN%22%3A100%2C%22SPINNINGTOP%22%3A-100%7D%2C%22rsi%22%3A54.11703199834508%2C%22adx%22%3A17.48349489648226%2C%22drawdown%22%3A-0.3851589132104152%2C%22p%22%3A106.3165951456645%2C%22pr%22%3A29.83226766038364%2C%22alpha%25%22%3A0.9860133511879561%2C%22beta%25%22%3A0.7161309516009406%2C%22drawup%25%22%3A0.822085864068955%2C%22sharpe%25%22%3A0.9963630552223526%2C%22natr%25%22%3A0.2054969027981061%2C%22drawdown%25%22%3A0.8771063809883024%2C%22p%25%22%3A0.6470561300424011%2C%22pr%25%22%3A0.1451672967149533%2C%22prophet%22%3A%5B%7B%22days%22%3A0%2C%22low%22%3A165%2C%22mid%22%3A165%2C%22high%22%3A165%7D%2C%7B%22days%22%3A15%2C%22low%22%3A163.7%2C%22mid%22%3A169.5%2C%22high%22%3A175.1%7D%2C%7B%22days%22%3A30%2C%22low%22%3A165.4%2C%22mid%22%3A171.2%2C%22high%22%3A177.1%7D%2C%7B%22days%22%3A45%2C%22low%22%3A170.7%2C%22mid%22%3A176.5%2C%22high%22%3A182.2%7D%2C%7B%22days%22%3A63%2C%22low%22%3A173.7%2C%22mid%22%3A179.1%2C%22high%22%3A184.7%7D%2C%7B%22days%22%3A100%2C%22low%22%3A175.4%2C%22mid%22%3A181%2C%22high%22%3A186.9%7D%2C%7B%22days%22%3A160%2C%22low%22%3A187.9%2C%22mid%22%3A194.5%2C%22high%22%3A200.3%7D%2C%7B%22days%22%3A252%2C%22low%22%3A198.9%2C%22mid%22%3A206.4%2C%22high%22%3A213.6%7D%2C%7B%22days%22%3A400%2C%22low%22%3A208.9%2C%22mid%22%3A220.2%2C%22high%22%3A229.4%7D%2C%7B%22days%22%3A700%2C%22low%22%3A243.9%2C%22mid%22%3A265.5%2C%22high%22%3A285.2%7D%2C%7B%22days%22%3A1260%2C%22low%22%3A285.3%2C%22mid%22%3A340.1%2C%22high%22%3A386.8%7D%5D%7D%2C%2210%22%3A%7B%22alpha%22%3A0.26643680361805%2C%22beta%22%3A1.165412736183007%2C%22drawup%22%3A13.9992503855486%2C%22sharpe%22%3A0.9518477801071726%2C%22natr%22%3A2.101984717961208%2C%22sup%22%3A-0.04650889294640578%2C%22res%22%3A0.1464666549561269%2C%22pattern%22%3A%7B%7D%2C%22rsi%22%3A51.80186150883466%2C%22adx%22%3A10.72577498526493%2C%22drawdown%22%3A-0.4379716346936321%2C%22p%22%3A206.7487300196958%2C%22pr%22%3A56.85377777333246%2C%22alpha%25%22%3A0.9473239914652266%2C%22beta%25%22%3A0.6695793176912768%2C%22drawup%25%22%3A0.9907013906317614%2C%22sharpe%25%22%3A0.9729734733157551%2C%22natr%25%22%3A0.2534022602159784%2C%22drawdown%25%22%3A0.8160138592095293%2C%22p%25%22%3A0.6897057969864255%2C%22pr%25%22%3A0.1467050735005236%2C%22prophet%22%3A%5B%7B%22days%22%3A0%2C%22low%22%3A165%2C%22mid%22%3A165%2C%22high%22%3A165%7D%2C%7B%22days%22%3A15%2C%22low%22%3A163.7%2C%22mid%22%3A169.5%2C%22high%22%3A175.1%7D%2C%7B%22days%22%3A30%2C%22low%22%3A165.4%2C%22mid%22%3A171.2%2C%22high%22%3A177.1%7D%2C%7B%22days%22%3A45%2C%22low%22%3A170.7%2C%22mid%22%3A176.5%2C%22high%22%3A182.2%7D%2C%7B%22days%22%3A63%2C%22low%22%3A173.7%2C%22mid%22%3A179.1%2C%22high%22%3A184.7%7D%2C%7B%22days%22%3A100%2C%22low%22%3A175.4%2C%22mid%22%3A181%2C%22high%22%3A186.9%7D%2C%7B%22days%22%3A160%2C%22low%22%3A187.9%2C%22mid%22%3A194.5%2C%22high%22%3A200.3%7D%2C%7B%22days%22%3A252%2C%22low%22%3A198.9%2C%22mid%22%3A206.4%2C%22high%22%3A213.6%7D%2C%7B%22days%22%3A400%2C%22low%22%3A208.9%2C%22mid%22%3A220.2%2C%22high%22%3A229.4%7D%2C%7B%22days%22%3A700%2C%22low%22%3A243.9%2C%22mid%22%3A265.5%2C%22high%22%3A285.2%7D%2C%7B%22days%22%3A1260%2C%22low%22%3A285.3%2C%22mid%22%3A340.1%2C%22high%22%3A386.8%7D%2C%7B%22days%22%3A1750%2C%22low%22%3A316.9%2C%22mid%22%3A405.2%2C%22high%22%3A482%7D%2C%7B%22days%22%3A2520%2C%22low%22%3A357.4%2C%22mid%22%3A505.7%2C%22high%22%3A644.9%7D%5D%7D%2C%22global%22%3A%7B%22symbol%22%3A%22AAPL%22%2C%22lastclose%22%3A164.8500061035156%2C%22name%22%3A%22Apple%20Inc.%22%2C%22market%20cap%22%3A2563672465800%2C%22country%22%3A%22United%20States%22%2C%22ipo%20year%22%3A1980%2C%22sector%22%3A%22Technology%22%2C%22industry%22%3A%22Computer%20Manufacturing%22%2C%22notes%22%3A%22%22%7D%2C%223mo%22%3A%7B%22alpha%22%3A-0.1321765501588742%2C%22beta%22%3A1.2891106804503%2C%22drawup%22%3A0.1246292546387422%2C%22sharpe%22%3A0.1248296666404515%2C%22natr%22%3A2.841100193503696%2C%22sup%22%3A-0.03691896322799545%2C%22res%22%3A0.01825428359073291%2C%22pattern%22%3A%7B%22HANGINGMAN%22%3A-100%7D%2C%22rsi%22%3A39.95870989108699%2C%22adx%22%3A45.46530566764927%2C%22drawdown%22%3A-0.1252128237075558%2C%22p%22%3A8.643581239714223%2C%22pr%22%3A6.12829402689641%2C%22alpha%25%22%3A0.5606511961385701%2C%22beta%25%22%3A0.5965058131451052%2C%22drawup%25%22%3A0.2525822186878391%2C%22sharpe%25%22%3A0.578260801607247%2C%22natr%25%22%3A0.2432617425082456%2C%22drawdown%25%22%3A0.7506033933672027%2C%22p%25%22%3A0.5244388683638413%2C%22pr%25%22%3A0.1581418555871781%2C%22prophet%22%3A%5B%7B%22days%22%3A0%2C%22low%22%3A165%2C%22mid%22%3A165%2C%22high%22%3A165%7D%2C%7B%22days%22%3A15%2C%22low%22%3A163.7%2C%22mid%22%3A169.5%2C%22high%22%3A175.1%7D%2C%7B%22days%22%3A30%2C%22low%22%3A165.4%2C%22mid%22%3A171.2%2C%22high%22%3A177.1%7D%2C%7B%22days%22%3A45%2C%22low%22%3A170.7%2C%22mid%22%3A176.5%2C%22high%22%3A182.2%7D%2C%7B%22days%22%3A63%2C%22low%22%3A173.7%2C%22mid%22%3A179.1%2C%22high%22%3A184.7%7D%5D%7D%7D&section=Growth&timeframe=1&symbol=AAPL
