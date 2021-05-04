import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";

const navBarLinks = [
  {
    name: "Home",
    path: "/",
  },
  { name: "Explore", path: "/explore" },
  { name: "Account", path: "/account" },
];

export default function NavBar() {
  const router = useRouter();

  return (
    <div>
      {navBarLinks.map((link) => {
        return (
          <a href={link.path} className={styles.link}>
            {link.name}
          </a>
        );
      })}
    </div>
  );
}
