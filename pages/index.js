import HeaderAndFooter from "../components/HeaderAndFooter";
import styles from "./index.module.css";
import Wave from "react-wavify";
import ***REMOVED*** isChrome, isEdge ***REMOVED*** from "react-device-detect";
import ***REMOVED*** useState, useEffect ***REMOVED*** from "react";
import MemoryRoundedIcon from "@material-ui/icons/MemoryRounded";
import StorageRoundedIcon from "@material-ui/icons/StorageRounded";
import BarChartRoundedIcon from "@material-ui/icons/BarChartRounded";
import Particles from "react-tsparticles";

const iconColor = "#7EA0FF";
const iconSize = 42;

const otherServices = ["robinhood", "etrade", "td", "tradingview", "finviz"];

export default function Home() ***REMOVED***
  const [browser, setBrowser] = useState(undefined);

  useEffect(async () => ***REMOVED***
    if (navigator.brave && (await navigator.brave.isBrave())) ***REMOVED***
      setBrowser("Brave");
    ***REMOVED*** else if (isChrome) ***REMOVED***
      setBrowser("Chrome");
    ***REMOVED*** else if (isEdge) ***REMOVED***
      setBrowser("Edge");
    ***REMOVED***
  ***REMOVED***, []);

  const tech = [
    ***REMOVED***
      title: "Machine Learning",
      for: "extracting trends from noisy data",
      icon: (
        <MemoryRoundedIcon style=***REMOVED******REMOVED*** color: iconColor, fontSize: iconSize ***REMOVED******REMOVED*** />
      ),
    ***REMOVED***,
    ***REMOVED***
      title: "Multivariate Statistics",
      for: "drawing inference from observation",
      icon: (
        <BarChartRoundedIcon style=***REMOVED******REMOVED*** color: iconColor, fontSize: iconSize ***REMOVED******REMOVED*** />
      ),
    ***REMOVED***,
    ***REMOVED***
      title: "Distributed Data Streams",
      for: "up-to-date metrics, avaliable 24/7",
      icon: (
        <StorageRoundedIcon style=***REMOVED******REMOVED*** color: iconColor, fontSize: iconSize ***REMOVED******REMOVED*** />
      ),
    ***REMOVED***,
    ***REMOVED***
      title: "Chromium Compatability",
      for: "by-your-side assistance",
    ***REMOVED***,
  ];

  return (
    <HeaderAndFooter overlayHeader=***REMOVED***true***REMOVED***>
      <div className=***REMOVED***styles.cover***REMOVED***>
        <Wave
          style=***REMOVED******REMOVED***
            height: 400,
          ***REMOVED******REMOVED***
          className="absoluteBottom"
          fill="url(#gradient)"
          paused=***REMOVED***false***REMOVED***
          options=***REMOVED******REMOVED***
            height: 50,
            amplitude: 100,
            speed: 0.1,
            points: 5,
          ***REMOVED******REMOVED***
        >
          <defs>
            <linearGradient id="gradient" gradientTransform="rotate(90)">
              <stop offset="0%" stopColor="#ffffff40" />
              <stop offset="100%" stopColor="#ffffff00" />
            </linearGradient>
          </defs>
        </Wave>
        <Wave
          style=***REMOVED******REMOVED***
            height: 200,
          ***REMOVED******REMOVED***
          className=***REMOVED***`absoluteBottom $***REMOVED***styles.flipX***REMOVED***`***REMOVED***
          fill="url(#gradient)"
          paused=***REMOVED***false***REMOVED***
          options=***REMOVED******REMOVED***
            height: 40,
            amplitude: 80,
            speed: 0.1,
            points: 5,
          ***REMOVED******REMOVED***
        >
          <defs>
            <linearGradient id="gradient" gradientTransform="rotate(90)">
              <stop offset="0%" stopColor="#ffffff40" />
              <stop offset="100%" stopColor="#ffffff00" />
            </linearGradient>
          </defs>
        </Wave>
        <div className=***REMOVED***styles.flexCenter***REMOVED***>
          <h2>
            ***REMOVED***`It's $***REMOVED***new Date().getFullYear()***REMOVED***. Meet your new `***REMOVED***
            <br />
            <span>
              Stock Investing
              <br />
              Assistant
            </span>
          </h2>
          ***REMOVED***browser ? (
            <a
              href="dummyurl"
              className=***REMOVED***styles.addButton***REMOVED***
            >***REMOVED***`Add to $***REMOVED***browser***REMOVED***`***REMOVED***</a>
          ) : null***REMOVED***
        </div>
      </div>
      <div className=***REMOVED***`$***REMOVED***styles.about***REMOVED*** $***REMOVED***styles.flexCenter***REMOVED***`***REMOVED***>
        <Particles
          className=***REMOVED***styles.tsparticles***REMOVED***
          options=***REMOVED******REMOVED***
            background: ***REMOVED***
              color: ***REMOVED***
                value: "white",
              ***REMOVED***,
            ***REMOVED***,
            fpsLimit: 60,
            interactivity: ***REMOVED***
              events: ***REMOVED***
                resize: true,
              ***REMOVED***,
            ***REMOVED***,
            particles: ***REMOVED***
              color: ***REMOVED***
                value: "#EAF0FF",
              ***REMOVED***,
              move: ***REMOVED***
                direction: "top-right",
                enable: true,
                outMode: "out",
                random: false,
                speed: 1,
                straight: true,
              ***REMOVED***,
              number: ***REMOVED***
                density: ***REMOVED***
                  enable: true,
                  value_area: 3000,
                ***REMOVED***,
                value: 80,
              ***REMOVED***,
              opacity: ***REMOVED***
                value: 1,
              ***REMOVED***,
              shape: ***REMOVED***
                type: "circle",
              ***REMOVED***,
              size: ***REMOVED***
                random: true,
                value: 10,
              ***REMOVED***,
            ***REMOVED***,
            detectRetina: true,
          ***REMOVED******REMOVED***
        />
        <h3>
          <span>Investivision</span> is a platform of modern consumer***REMOVED***" "***REMOVED***
          <span>investing tools</span>.
        </h3>
        <h3
          style=***REMOVED******REMOVED***
            marginTop: 40,
          ***REMOVED******REMOVED***
        >
          Our mission is to support your journey to***REMOVED***" "***REMOVED***
          <span>well calculated trades</span> with the help of***REMOVED***" "***REMOVED***
          <span>cutting-edge technologies</span> and***REMOVED***" "***REMOVED***
          <span>analysis methods</span>, such as
        </h3>
        <div className=***REMOVED***styles.techContainer***REMOVED***>
          ***REMOVED***tech.map((element, i) => ***REMOVED***
            return (
              <div className=***REMOVED***styles.tech***REMOVED*** key=***REMOVED***i***REMOVED***>
                ***REMOVED***element.icon***REMOVED***
                <p className=***REMOVED***styles.techTitle***REMOVED***>***REMOVED***element.title***REMOVED***</p>
                <p className=***REMOVED***styles.techFor***REMOVED***>***REMOVED***`for $***REMOVED***element.for***REMOVED***`***REMOVED***</p>
              </div>
            );
          ***REMOVED***)***REMOVED***
        </div>
        <h3>While improving your existing experiences with</h3>
        <div className=***REMOVED***styles.brokerages***REMOVED***>
          ***REMOVED***otherServices.map((service, i) => ***REMOVED***
            return <img src=***REMOVED***`/images/$***REMOVED***service***REMOVED***.png`***REMOVED*** key=***REMOVED***i***REMOVED*** />;
          ***REMOVED***)***REMOVED***
        </div>
      </div>
    </HeaderAndFooter>
  );
***REMOVED***
