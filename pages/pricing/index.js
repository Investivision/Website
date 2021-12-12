import HeaderAndFooter from "../../components/HeaderAndFooter";
import styles from "./index.module.css";
import { useState } from "react";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

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
    title: "Trader",
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
      "Mass xlsx Downloads",
    ],
  },
];

export default function Pricing(props) {
  const [isMonthly, setIsMonthly] = useState(false);

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
              {isMonthly ? null : (
                <p className={styles.discount}>
                  {plan.monthlyCost
                    ? `Save ${Math.round(
                        ((plan.monthlyCost - plan.annualCost / 12) /
                          plan.monthlyCost) *
                          100
                      )}%`
                    : "Still Free!"}
                </p>
              )}
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
              <Button variant="contained" size="large" color="primary">
                Get Started
              </Button>
            </div>
          );
        })}
      </div>
    </HeaderAndFooter>
  );
}
