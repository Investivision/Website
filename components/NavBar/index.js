import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import Button from "@material-ui/core/Button";

const navBarLinks = [
  {
    name: "Features",
    path: "/",
  },
  { name: "Analysis", path: "/analysis" },
  { name: "FAQ", path: "/analysis" },
  { name: "Pricing", path: "/account" },
  { name: "Account", path: "/account" },
];

export default function NavBar() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <a className={styles.logoContainer} href="/">
        <img src="/logo.png"></img>
        <h1>Investivision</h1>
      </a>
      <div className={styles.linksContainer}>
        {navBarLinks.map((link) => {
          return (
            <a href={link.path} className={styles.link}>
              {link.name}
            </a>
          );
        })}
      </div>
      <div className={styles.rightContainer}>
        <Button variant="outlined" color="secondary" className="loginButton">
          Login
        </Button>
      </div>
    </div>
  );
}
