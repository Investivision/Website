import styles from "./report.module.css";
import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
} from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import Skeleton from "@mui/material/Skeleton";
import UpgradeButton from "./UpgradeButton";

let savedValue;
let autosaveInterval;

const getValidCacheEntry = (symbol) => {
  const stored = window.localStorage.getItem(symbol + "-notes");
  if (!stored) {
    return undefined;
  }
  const { timestamp, notes } = JSON.parse(stored);
  if (timestamp + 1000 * 60 * 15 < Date.now()) {
    // expired entry
    window.localStorage.removeItem(symbol + "-notes");
    return undefined;
  }
  return notes;
};

export default function TextArea(props) {
  const [notesText, setNotesText] = useState(props.notes);
  const [saved, setSaved] = useState(true);
  const [notesLoading, setNotesLoading] = useState(true);

  //

  useEffect(() => {
    setNotesText(props.notes);
    setSaved(true);
  }, [props.symbol]);

  useEffect(async () => {
    if (window.location.pathname != "/" && props.notes !== undefined) {
      const cached = getValidCacheEntry(props.symbol);
      if (cached) {
        setNotesText(cached);
        setNotesLoading(false);
        setSaved(true);
        return;
      }
      setNotesLoading(true);
      const docSnap = await getDoc(
        doc(
          getFirestore(),
          "notes",
          `${getAuth().currentUser.uid}-${props.symbol}`
        )
      );
      if (docSnap.exists()) {
        window.localStorage.setItem(
          props.symbol + "-notes",
          JSON.stringify({
            timestamp: new Date(),
            notes: docSnap.data().notes,
          })
        );
        setNotesText(docSnap.data().notes);
      }
      setNotesLoading(false);
    } else {
      setNotesLoading(false);
    }
  }, [props.symbol]);

  if (props.notes === undefined) {
    return <UpgradeButton port={props.port} />;
  }

  const saveNotes = async (curr) => {
    if (window.location.pathname != "/") {
      await setDoc(
        doc(
          collection(getFirestore(), "notes"),
          `${getAuth().currentUser.uid}-${props.symbol}`
        ),
        {
          notes: curr,
        },
        {
          merge: true,
        }
      );
      window.localStorage.setItem(
        props.symbol + "-notes",
        JSON.stringify({
          timestamp: new Date(),
          notes: curr,
        })
      );
      //
      savedValue = curr;
      //
    }
  };

  //
  return (
    <>
      <p
        style={{
          marginTop: -16,
          marginBottom: 16,
          fontSize: 12,
          opacity: 0.3,
        }}
      >
        {saved ? "Saved" : "Syncing..."}
      </p>
      {notesLoading ? (
        <Skeleton
          animation="wave"
          height={100}
          style={{
            width: "100%",
          }}
          sx={{
            transform: "none",
          }}
        />
      ) : (
        <textarea
          placeholder="In January, set limit sell order."
          value={notesText}
          onChange={(e) => {
            setNotesText(e.target.value);
            setSaved(e.target.value == savedValue);
          }}
          onFocus={() => {
            autosaveInterval = setInterval(async () => {
              const curr = notesText;
              if (curr !== savedValue) {
                await saveNotes(curr);
              }
              setSaved(true);
            }, 10000);
          }}
          onBlur={async () => {
            clearInterval(autosaveInterval);
            const curr = notesText;
            if (curr != savedValue) {
              await saveNotes(curr);
            }
            setSaved(true);
          }}
        ></textarea>
      )}
    </>
  );
}
