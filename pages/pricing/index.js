import HeaderAndFooter from "../../components/HeaderAndFooter";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import { useTheme } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { getFunction, auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

const plans = [
  {
    title: "Basic",
    features: [
      "Chome Extension",
      "50 Symbols",
      "10 Reports / Day",
      "Growth & Risk Metrics",
    ],
  },
  {
    title: "Bullish",
    monthlyCost: 9,
    annualCost: 90,
    features: [
      "Chome Extension",
      "All Symbols",
      "Unlimited Reports",
      "Growth & Risk Metrics",
      "Pattern Recognition",
      "AI Forecasting",
    ],
    monthlyPriceId: "price_1K6j11ACbhl0jE7ZuLJoDW54",
    yearlyPriceId: "price_1K6jPbACbhl0jE7ZoGLvulow",
  },
  {
    title: "Buffet",
    monthlyCost: 19,
    annualCost: 190,
    features: [
      "Chome Extension",
      "All Symbols",
      "Unlimited Reports",
      "Growth & Risk Metrics",
      "Pattern Recognition",
      "AI Forecasting",
      "Integrated Notes",
      "Ranking & Filtering",
      "Batch Excel Export",
    ],
  },
];

export default function Pricing(props) {
  const [isMonthly, setIsMonthly] = useState(true);
  const [planLoading, setPlanLoading] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [userLoading, setUserLoading] = useState(true);
  const [role, setRole] = useState(undefined);

  const router = useRouter();

  const updateRole = async () => {
    if (user) {
      await user.getIdToken(true);
      const token = await user.getIdTokenResult(true);
      console.log("found token", token);
      if (token.claims.role) {
        setRole(token.claims.role);
      } else {
        setRole(undefined);
        console.log("query", router.query);
        if (router.query.success) {
          setTimeout(updateRole, 1000);
        }
      }
    } else {
      setRole(undefined);
    }
  };

  console.log(user);

  onAuthStateChanged(auth, async (user) => {
    setUser(user);
    setUserLoading(false);
  });

  useEffect(async () => {
    updateRole();
  }, [user]);

  const theme = useTheme();

  return (
    <HeaderAndFooter bodyClassName={styles.body}>
      <h1 className="pageHeader">Pricing and Plans</h1>
      <ToggleButtonGroup
        color={theme.palette.mode == "dark" ? "secondary" : "primary"}
        exclusive
        onChange={(event, val) => {
          setIsMonthly(val);
        }}
        className={styles.toggle}
      >
        <ToggleButton
          value={true}
          selected={isMonthly}
          // color={!isLogin ? "primary" : "secondary"}
        >
          Monthly
        </ToggleButton>
        <ToggleButton
          value={false}
          selected={!isMonthly}
          // color={isLogin ? "primary" : "secondary"}
        >
          Annual
        </ToggleButton>
      </ToggleButtonGroup>
      <div className={styles.pricing}>
        {plans.map((plan) => {
          return (
            <div
              key={plan.title}
              className={styles.plan}
              style={{
                backgroundColor:
                  theme.palette.mode == "dark" ? "#050D18" : "white",
              }}
            >
              <h3>{plan.title}</h3>
              <h4>
                {!plan.monthlyCost
                  ? "Free!"
                  : "$" +
                    (isMonthly
                      ? `${plan.monthlyCost} / mo`
                      : `${plan.annualCost} / yr`)}
              </h4>
              {!isMonthly && plan.monthlyCost ? (
                <p className={styles.discount}>{`Save ${Math.round(
                  ((plan.monthlyCost - plan.annualCost / 12) /
                    plan.monthlyCost) *
                    100
                )}%`}</p>
              ) : null}
              <div className={styles.featureContainer}>
                {plan.features.map((feature) => {
                  return (
                    <div key={feature} className={styles.feature}>
                      <CheckCircleRoundedIcon />
                      <p>{feature}</p>
                    </div>
                  );
                })}
              </div>
              {plan.monthlyCost ? (
                <LoadingButton
                  variant="contained"
                  size="large"
                  color="primary"
                  loading={planLoading === plan.title || userLoading}
                  onClick={async () => {
                    setPlanLoading(plan.title);
                    if (!user) {
                      window.location.href = "/login";
                      return;
                    }
                    await user.getIdToken(true);
                    let res;
                    if ((await user.getIdTokenResult()).claims.role) {
                      res = await getFunction("createPortalLink")({
                        returnUrl: window.location.href,
                      });
                    } else {
                      res = await getFunction("createCheckoutSession")({
                        successUrl: window.location.href + "?success=true",
                        cancelUrl: window.location.href,
                        priceId: isMonthly
                          ? plan.monthlyPriceId
                          : plan.yearlyPriceId,
                      });
                    }
                    window.location.href = res.data;
                  }}
                >
                  {role == plan.title.toLowerCase()
                    ? "Manage Plan"
                    : `Get Started`}
                </LoadingButton>
              ) : null}
            </div>
          );
        })}
      </div>
    </HeaderAndFooter>
  );
}
