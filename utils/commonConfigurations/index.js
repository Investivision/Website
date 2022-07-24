export default [
  {
    name: "Stable Long-Term Picks",
    sort: ["Sharpe, 10yr", "asc"],
    cols: ["Sharpe, 10yr", "Alpha, 10yr", "Last Close"],
    desc: "Best Sharpe, 10yr",
    filters: [
      {
        feature: "Sharpe, 10yr",
        relation: "exists",
        value: "",
      },
      {
        feature: "Last Close",
        relation: ">",
        value: "20",
      },
    ],
  },
  {
    name: "Past-Year Champions",
    sort: ["Alpha, 1yr", "asc"],
    cols: ["Alpha, 1yr", "Sharpe, 1yr", "Last Close"],
    desc: "Best Alpha, 1yr",
    filters: [
      {
        feature: "Alpha, 1yr",
        relation: "exists",
        value: "",
      },
    ],
  },
  {
    name: "Nearby Expected Rebounds",
    sort: ["Support, 3mo", "asc"],
    desc: "Close to Support Line with weak Relative Strength",
    filters: [
      {
        feature: "Resistance, 3mo",
        relation: "exists",
        value: "",
      },
      {
        feature: "Resistance, 3mo",
        relation: ">",
        value: "Support, 3mo + 0.07",
      },
    ],
    cols: ["Support, 3mo", "Resistance, 3mo", "Last Close"],
  },
  {
    name: "High Volatility Movers",
    desc: "Choppy prices with extreme movements",
    sort: ["True Range, 1yr", "asc"],
    filters: [],
    cols: ["True Range, 1yr", "Beta, 1yr", "Resistance, 3mo", "Support, 3mo"],
  },
  {
    name: "Forecasted Long-Term Winners",
    desc: "Top picks by our AI-driven forecasting service",
    sort: ["AI Forecast in 10yr", "asc"],
    filters: [
      {
        feature: "AI Forecast in 10yr",
        relation: "exists",
        value: "",
      },
      {
        feature: "Forecast Range in 10yr",
        relation: "<",
        value: "80",
      },
    ],
    cols: [
      "AI Forecast in 10yr",
      "AI Forecast in 5yr",
      "AI Forecast in 1yr",
      "AI Forecast in 3mo",
    ],
  },
  {
    name: "The Tech Backbone",
    desc: "Tech companies leading the way for stock growth",
    sort: ["Alpha, 5yr", "asc"],
    filters: [
      {
        feature: "Sector",
        relation: "=",
        value: '"Technology"',
      },
      {
        feature: "Alpha, 5yr",
        relation: "exists",
        value: "",
      },
    ],
    cols: ["Alpha, 5yr", "Sharpe, 5yr", "Industry"],
  },
];
