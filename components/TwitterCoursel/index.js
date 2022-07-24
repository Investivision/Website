import { TwitterTweetEmbed } from "react-twitter-embed";
import { useMemo } from "react";
import { useTheme } from "@mui/styles";
import styles from "./index.module.css";

const tweetIds = [
  "1500694770083057673",
  "1498901100837097472",
  "1498900372647260160",
  "1498870990213984263",
];

export default function TwitterCarousel() {
  const theme = useTheme();

  const tweetComponents = useMemo(() => {
    let out = tweetIds
      .concat(tweetIds)
      .map((id, i) => (
        <TwitterTweetEmbed
          key={id + theme.palette.mode + i}
          tweetId={id}
          options={{ theme: theme.palette.mode }}
        />
      ));
    return out;
  }, [theme.palette.mode]);

  return (
    <div className={styles.carousel}>
      <div
        className={styles.tweets}
        style={{
          //   animation: "rotate 20s linear infinite",
          animationName: styles.rotate,
          animationDuration: `${tweetComponents.length * 5}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          margin: "30px 0",
        }}
      >
        {tweetComponents}
        <div
          style={{
            position: "absolute",
            left: 0,
            transform: "translateX(-100%)",
          }}
        >
          {tweetComponents[tweetComponents.length - 1]}
        </div>
      </div>
    </div>
  );
}
