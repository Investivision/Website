import HeaderAndFooter from "../components/HeaderAndFooter";
import styles from "./index.module.css";
import Wave from "react-wavify";
import { isChrome, isEdge } from "react-device-detect";
import { useState, useEffect } from "react";
import MemoryRoundedIcon from "@material-ui/icons/MemoryRounded";
import StorageRoundedIcon from "@material-ui/icons/StorageRounded";
import BarChartRoundedIcon from "@material-ui/icons/BarChartRounded";
import Particles from "react-tsparticles";

const iconColor = "#7EA0FF";
const iconSize = 42;

const otherServices = ["robinhood", "etrade", "td", "tradingview", "finviz"];

export default function Home() {
  const [browser, setBrowser] = useState(undefined);

  useEffect(async () => {
    if (navigator.brave && (await navigator.brave.isBrave())) {
      setBrowser("Brave");
    } else if (isChrome) {
      setBrowser("Chrome");
    } else if (isEdge) {
      setBrowser("Edge");
    }
  }, []);

  const tech = [
    {
      title: "Machine Learning",
      for: "extracting trends from noisy data",
      icon: (
        <MemoryRoundedIcon style={{ color: iconColor, fontSize: iconSize }} />
      ),
    },
    {
      title: "Multivariate Statistics",
      for: "drawing inference from observation",
      icon: (
        <BarChartRoundedIcon style={{ color: iconColor, fontSize: iconSize }} />
      ),
    },
    {
      title: "Distributed Data Streams",
      for: "up-to-date metrics, avaliable 24/7",
      icon: (
        <StorageRoundedIcon style={{ color: iconColor, fontSize: iconSize }} />
      ),
    },
    {
      title: "Chromium Compatability",
      for: "by-your-side assistance",
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
        <div className={styles.flexCenter}>
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
      </div>
      <div className={`${styles.about} ${styles.flexCenter}`}>
        <Particles
          className={styles.tsparticles}
          options={{
            background: {
              color: {
                value: "white",
              },
            },
            fpsLimit: 60,
            interactivity: {
              events: {
                resize: true,
              },
            },
            particles: {
              color: {
                value: "#EAF0FF",
              },
              move: {
                direction: "top-right",
                enable: true,
                outMode: "out",
                random: false,
                speed: 1,
                straight: true,
              },
              number: {
                density: {
                  enable: true,
                  value_area: 3000,
                },
                value: 80,
              },
              opacity: {
                value: 1,
              },
              shape: {
                type: "circle",
              },
              size: {
                random: true,
                value: 10,
              },
            },
            detectRetina: true,
          }}
        />
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
          <span>cutting-edge technologies</span> and{" "}
          <span>analysis methods</span>, such as
        </h3>
        <div className={styles.techContainer}>
          {tech.map((element, i) => {
            return (
              <div className={styles.tech} key={i}>
                {element.icon}
                <p className={styles.techTitle}>{element.title}</p>
                <p className={styles.techFor}>{`for ${element.for}`}</p>
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
