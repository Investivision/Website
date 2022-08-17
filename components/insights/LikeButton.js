import IconButton from "@mui/material/IconButton";
import GradeOutlined from "@material-ui/icons/GradeOutlined";
import Grade from "@material-ui/icons/Grade";
import styles from "./grid.module.css";

import { useTheme } from "@mui/styles";

export default function LikeButton({ likes, onUnlike, onLike, val }) {
  const theme = useTheme();

  return (
    <IconButton
      size="small"
      className={styles.symbolIconButton}
      onClick={() => {
        likes.has(val) ? onUnlike(val) : onLike(val);
      }}
    >
      {likes.has(val) ? (
        <Grade
          className={styles.likeIcon}
          style={{
            opacity: 1,
            color: theme.palette.primary.main,
          }}
        />
      ) : (
        <GradeOutlined className={styles.likeIcon} />
      )}
    </IconButton>
  );
}
