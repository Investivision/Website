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

let savedValue;
let autosaveInterval;

const notesCache = {};

const getValidCacheEntry = (symbol) => {
  const stored = notesCache[symbol];
  if (!stored) {
    return undefined;
  }
  const { timestamp, notes } = stored;
  if (timestamp + 1000 * 60 * 15 < Date.now()) {
    // expired entry
    delete notesCache[symbol];
    return undefined;
  }
  return notes;
};

export default function TextArea(props) {
  const [notesText, setNotesText] = useState(props.notes);
  const [saved, setSaved] = useState(true);
  const [notesLoading, setNotesLoading] = useState(props.localFirebase);

  console.log("localFirebase", props.localFirebase);

  useEffect(() => {
    setNotesText(props.notes);
    setSaved(true);
  }, [props.symbol]);

  useEffect(async () => {
    if (props.localFirebase) {
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
        notesCache[props.symbol] = {
          timestamp: new Date(),
          notes: docSnap.data().notes,
        };
        setNotesText(docSnap.data().notes);
      }
      setNotesLoading(false);
    }
  }, [props.symbol]);

  const saveNotes = async (curr) => {
    if (props.localFirebase) {
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
      notesCache[props.symbol] = {
        timestamp: new Date(),
        notes: curr,
      };
    } else if (props.port) {
      props.port.postMessage({
        symbol: props.symbol,
        notes: curr,
      });
    }
    console.log("new saved value is", curr);
    savedValue = curr;
    console.log("reading from saved value", savedValue);
  };

  console.log("TextArea props", props);
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
