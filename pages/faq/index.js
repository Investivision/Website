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
  Insights: [
    {
      q: "How are insights derived?",
      a: "Investivision has discovered, implemented, and continues to improve an advance stock evaluation algorithm grounded in top-level trading theory, technical analysis, multivariate statistics, machine learning, and simulation.",
    },
    {
      q: "How frequently are insights computed?",
      a: "Insights are computed immediately after every market close, and are available within the hour after.",
    },
    {
      q: `Why is an insight n/a or empty?`,
      a: "Some metrics depend on adequate price history. If this duration is not met, these metrics cannot be computed.",
    },
    {
      q: "Why are percentiles important?",
      a: "Percentiles indicate a stock's metric score in comparison to the rest of the market. For example, a stock with an alpha percentile of 95% means that is alpha metric is estimated to be better than 95% of stocks in the market.",
    },
  ],
  Account: [
    {
      q: "Are my credentials secure?",
      a: "Yes. We securely store password hashes instead of passwords themselves. Only you will know your password. Furthermore, you can opt to login using your Google Account to leverage their security measures.",
    },
    {
      q: "What if I forgot my password?",
      a: "On the <a>Login Page</a>, you can send a password reset email to yourself. If you created your account with a third-party authenticator, login using that instead.",
    },
    {
      q: "Why am I not receiving my password reset or verification email?",
      a: "Such emails will only be sent if your profile was originally created with email and password. Accounts created via third-party authenticators are exempt from these emails because all email changes must be registered with the third-party; Investivision does not know your credentials, and instead only exchanges tokens with the third-party authenticator.",
    },
  ],
  Subscription: [
    {
      q: "What is Stripe?",
      a: "Stripe is Investivision's payment processor and subscription manager.",
    },
    {
      q: "Where can I manage my subscription?",
      a: "Either navigate to the <a href='/account#subscription'>Subscription Section</a> on your Account Page to be navigated to Stripe, or enter your Stripe customer portal from an email Stripe has previously sent you. From there you can sign up, cancel, or update your plan.",
    },
    {
      q: "What is the cancellation policy?",
      a: "When you cancel, you will retain your access privileges until the subscription period ends. No further payments will be required.",
    },
  ],
  Screener: [
    {
      q: "What is a screener?",
      a: "A screener is a dynamic interface that allows you to easily and efficiently sift through, or screen, a large number of stocks and their corresponding metrics according to your preferences.",
    },
    {
      q: "How is Investivision's Insight Screener unique?",
      a: "Most screeners out there allow you to filter and sort by simple metrics and indicators. Realizing that these tools have their place, we constructed a highly-configurable screener based on interpretable, meaningful, insights to compliment existing tools for our non-robotic audience.",
    },
    {
      q: "What values appear in the screener?",
      a: "The values you see are Investivision's insights: pre-computed composite metrics presented across the platform, such as in the Chrome Extension. Read more FAQ <a href='/faq?topic=Insights'>here.</a>",
    },
    {
      q: "How does cell color-coding work?",
      a: "Color-coding aims to visually reflect the quality of a stock with respect to an insight. Each color, depending on the insight, is computed by means of percentile, quantity, threshold, bullish/bearish range, among other factors. Some insights are left uncolored because their values are not directly comparable to one another.",
    },
    {
      q: "How can I configure my screener?",
      a: "Above the screener grid is a toolbar that allows you to define which insights to display, a list of filters, and basic interface options. Within the grid, click on a column header to sort by the insight either ascending or descending order. You may also drag column headers to reorder columns.",
    },
  ],
  Extension: [
    {
      q: "Why isn't the Investivision Icon in the page corner?",
      a: "By design, not all pages are extension compatible. Only pages that showcase a specified symbol are supplemented with Investivision's interface.",
    },
    {
      q: "Why aren't more platforms and websites compatible?",
      a: "We are continually surveying new platforms and developing new integrations. Releases are on the horizon.",
    },
    {
      q: "Why can't I view all insight sections or have unlimited access to all symbols?",
      a: "Our subscription model provides tier-based access privileges. View the <a href='/pricing'>Pricing Page</a> to learn more.",
    },
  ],
};

export default function Login() {
  const theme = useTheme();
  const router = useRouter();

  //   const query = router.asPath.split("topic=");
  //   const initial = query.length > 1 ? query[1] : Object.keys(questions)[1];

  //

  const [selectedCat, setSelectedCat] = useState();

  //   router.asPath.split("topic=")[1]

  useEffect(() => {
    const query = router.asPath.split("topic=");
    const initial =
      query.length > 1 && questions[query[1]]
        ? query[1]
        : Object.keys(questions)[0];
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
            window.history.replaceState({}, "", `/faq?topic=${nextView}`);
          }}
          className={styles.toggle}
        >
          {Object.keys(questions).map((cat) => {
            return (
              <ToggleButton key={cat} value={cat} selected={cat == selectedCat}>
                {cat}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      ) : null}
      {selectedCat && (
        <div className={styles.questions}>
          {questions[selectedCat].map((question) => {
            return <Question question={question} key={question.q} />;
          })}
        </div>
      )}
    </HeaderAndFooter>
  );
}
