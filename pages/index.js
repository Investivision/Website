import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import NavBar from "../components/NavBar";

export default function Home() {
  return (
    <div className={styles.container}>
      <NavBar />
      <h1>home</h1>
    </div>
  );
}
