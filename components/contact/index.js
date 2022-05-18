import styles from "./index.module.css";
import { useTheme } from "@mui/styles";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import { getAuth } from "firebase/auth";
// import Tooltip from "@mui/material/Tooltip";
// import Zoom from "@mui/material/Zoom";

let user;

export default function Contact(props) {
  const theme = useTheme();

  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  return (
    // <Tooltip title="Contact" placement="top" arrow>
    <>
      <div
        className={styles.iconWrapper}
        style={{
          backgroundColor:
            theme.palette.mode == "dark"
              ? theme.palette.primary.dark
              : theme.palette.primary.main,
        }}
      >
        <IconButton
          id="supportIcon"
          size="large"
          onClick={() => {
            user = getAuth().currentUser;
            if (!name) {
              setName(user.displayName);
            }
            if (!email) {
              setEmail(user.email);
            }
            setFormOpen(true);
          }}
        >
          <QuestionAnswerIcon className={styles.icon} />
        </IconButton>
      </div>
      {formOpen && (
        <div
          className={styles.fullScreen}
          onClick={(e) => {
            setFormOpen(false);
          }}
        >
          <div
            className={styles.form}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <p className={styles.title}>Support and Contact</p>
            <p className={styles.caption}>Let us known how we can help!</p>
            <div className={styles.collapsableRow}>
              <TextField
                label="Name"
                variant="outlined"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />

              <TextField
                label="Subject"
                variant="outlined"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                }}
                //   sx={{
                //     width: "100%",
                //   }}
              />
              {/* <TextField
                label="Email"
                variant="outlined"
                defaultValue={user?.email}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              /> */}
            </div>
            <TextField
              label="Message"
              variant="outlined"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              minRows={2}
              multiline
              sx={{
                width: "100%",
              }}
            />
            <div className={styles.collapsableRow}>
              <Button
                variant="outlined"
                size="large"
                color="warning"
                onClick={() => {
                  setFormOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  const body = `${content}%0A%0A${name}`;
                  const url = `mailto:investivision@gmail.com?subject=${subject}&body=${body}`;
                  window.location.href = url;
                }}
              >
                Draft and Deliver
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
    // </Tooltip>
  );
}
