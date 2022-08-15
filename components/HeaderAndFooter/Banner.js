import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./index.module.css";
import { getAuth } from "firebase/auth";
import { useTheme } from "@mui/styles";
import Head from "next/head";

const colors = {
  light: "#46E58B",
  dark: "#008149",
};

export default function Banner(props) {
  if (props.developmentMode) {
    return (
      <div
        className={styles.banner}
        style={{
          backgroundColor: "#FF7000",
        }}
      >
        <p>Development Mode</p>
      </div>
    );
  }

  const [showing, setShowing] = useState(false);
  const [signedIn, setSignedIn] = useState(undefined);

  const theme = useTheme();

  getAuth().onAuthStateChanged(async (user) => {
    if (user) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  });

  useEffect(() => {
    const stored = window.localStorage.getItem(props.id);
    //
    console.log("banner stored", stored, props);
    if (!stored) {
      setShowing(true);
    }
  }, []);

  if (!showing || signedIn !== false) {
    return null;
  }

  const color = colors[theme.palette.mode];

  return (
    <Link href={props.link}>
      <div
        className={styles.banner}
        style={{
          backgroundColor: color,
        }}
      >
        <Head>
          <meta name="theme-color" content={color} />
        </Head>
        <p>{props.title}</p>
        <p
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowing(false);
            window.localStorage[props.id] = true;
          }}
        >
          | No thanks.
        </p>
      </div>
    </Link>
  );
}
