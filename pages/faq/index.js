import HeaderAndFooter from "../../components/HeaderAndFooter";
import styles from "./index.module.css";
import { NextSeo } from "next-seo";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useTheme } from "@mui/styles";
import { useState, useEffect } from "react";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import { useRouter } from "next/router";
import { query } from "firebase/firestore";
import { style } from "@mui/system";
import Question from "../../components/Question";

const questions = {
  Insights: [],
  Account: [],
  Subscription: [],
  Technology: [],
  Extension: [
    {
      q: "Why isn't the Investivision Icon in the page corner?",
      a: "By design, not all pages are extension compatible. Only pages that showcase a specified symbol are supplemented with Investivision's interface.",
    },
    {
      q: "Why aren't more platforms and websites compatible?",
      a: "We are continually surveying new platforms and developing new integrations. Releases are on the horizon.",
    },
  ],
};

export default function Login() {
  const theme = useTheme();
  const router = useRouter();

  //   const query = router.asPath.split("topic=");
  //   const initial = query.length > 1 ? query[1] : Object.keys(questions)[1];

  //   console.log("router", router, "query", query, "initial", initial);

  const [selectedCat, setSelectedCat] = useState();

  //   router.asPath.split("topic=")[1]

  useEffect(() => {
    const query = router.asPath.split("topic=");
    const initial =
      query.length > 1 && questions[query[1]]
        ? query[1]
        : Object.keys(questions)[1];
    setSelectedCat(initial);
    // if (router.query.topic) {
    //   setSelectedCat(router.query.topic);
    // } else {
    //   setSelectedCat(Object.keys(questions)[0]);
    // }
  }, []);

  return (
    <HeaderAndFooter bodyClassName={styles.body}>
      <NextSeo title="FAQ" />
      <h1 className="pageHeader">FAQ</h1>
      {selectedCat ? (
        <ToggleButtonGroup
          color={theme.palette.mode == "dark" ? "secondary" : "primary"}
          // exclusive
          onChange={(event, nextView) => {
            setSelectedCat(nextView);
          }}
          className={styles.toggle}
        >
          {Object.keys(questions).map((cat) => {
            console.log(cat, "selected?", cat == selectedCat);
            return (
              <ToggleButton key={cat} value={cat} selected={cat == selectedCat}>
                {cat}
                {/* <CloseRoundedIcon
                style={{
                  opacity: selectedCategories.has(cat) ? 1 : 0,
                }}
              /> */}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      ) : null}
      {selectedCat && (
        <div className={styles.questions}>
          {questions[selectedCat].map((question) => {
            return <Question question={question} />;
          })}
        </div>
      )}
    </HeaderAndFooter>
  );
}
