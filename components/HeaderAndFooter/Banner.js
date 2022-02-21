import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./index.module.css";
import { getAuth } from "firebase/auth";

export default function Banner() {
  const [showing, setShowing] = useState(false);
  const [signedIn, setSignedIn] = useState(undefined);

  getAuth().onAuthStateChanged(async (user) => {
    if (user) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  });

  useEffect(() => {
    const stored = window.localStorage.hideBanner;
    console.log("stored banner status", stored);
    if (!stored) {
      setShowing(true);
    }
  }, []);

  if (!showing || signedIn !== false) {
    return null;
  }

  return (
    <Link href="/pricing">
      <div className={styles.banner}>
        <p>50% off for a limited time!</p>
        <p
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowing(false);
            window.localStorage.hideBanner = true;
          }}
        >
          No thanks.
        </p>
      </div>
    </Link>
  );
}
