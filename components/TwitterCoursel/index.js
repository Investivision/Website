import { TwitterTweetEmbed } from "react-twitter-embed";
import { useEffect, useMemo } from "react";
import { useTheme } from "@mui/styles";
import styles from "./index.module.css";

// const tweetIds = [
//   "1500694770083057673",
//   "1498901100837097472",
//   // "1498900372647260160",
//   // "1498870990213984263",
// ];

export default function TwitterCarousel(props) {
  const theme = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--tweet-offset",
      `${-100 * props.ids.length}%`
    );
  }, []);

  const tweetComponents = useMemo(() => {
    let out = props.ids.concat(props.ids).map((id, i) => (
      <div
        className={styles.tweet}
        style={{
          //   animation: "rotate 20s linear infinite",
          animationName: styles.rotate,
          animationDuration: `${props.ids.length * 9}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          margin: "30px 0",
        }}
        onMouseEnter={() => {}}
      >
        <TwitterTweetEmbed
          key={id + theme.palette.mode + i}
          tweetId={id}
          options={{ theme: theme.palette.mode }}
        />
      </div>
    ));
    return out;
  }, [theme.palette.mode]);

  return (
    <div className={styles.carousel}>
      <div className={styles.tweets}>
        {tweetComponents}
        {/* <div
          style={{
            position: "absolute",
            left: 0,
            transform: "translateX(-100%)",
          }}
        >
          {tweetComponents[tweetComponents.length - 1]}
        </div> */}
      </div>
    </div>
  );
}
