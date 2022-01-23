import { useTheme } from "@mui/styles";
import styles from "./filter.module.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import DeleteIcon from "@material-ui/icons/DeleteForeverRounded";

const errorMessage = (value, cols, relation) => {
  console.log("errorMessage", value, cols);
  if (!value) {
    return undefined;
  }
  for (const col of cols) {
    value = value.split(col).join("123");
  }
  // const words = value.split(" ");
  // return words.every(word => {
  // const splitByOpenParen = value.split('(')
  // for (const part of splitByOpenParen) {
  //   if (part && (/[a-zA-Z]/).test(part.trim().charAt(part.length - 1)) ) {
  //     return "Cannot use functions"
  //   }
  // }
  if (/[a-zA-Z]/g.test(value) && !/^[a-zA-Z]+$/.test(value)) {
    return "Misspelled column";
  }
  try {
    // if all letters are alphabetic
    if (/^[a-zA-Z]+$/.test(value)) {
      value = `"${value}"`;
    }
    eval(value);
  } catch (e) {
    return "Expression error";
  }
  return undefined;
};

const splitValue = (value, cols) => {
  value = value.replaceAll(", ", ",").replaceAll(" %", "%");
  let start = 0;
  for (let i = value.length - 1; i >= 0; i--) {
    const char = value.charAt(i);
    if (
      !(
        /[a-zA-Z]/.test(char) ||
        char == "," ||
        char == "%" ||
        (!isNaN(char) &&
          (value.charAt(i - 1) == "," ||
            (value.charAt(i - 2) == "," && !isNaN(value.charAt(i - 1)))))
      )
    ) {
      start = i + 1;
      break;
    }
  }

  const lastWord = value
    .substring(start)
    .replaceAll(",", ", ")
    .replaceAll("%", " %");
  const before = value
    .substring(0, start)
    .replaceAll(",", ", ")
    .replaceAll("%", " %");
  console.log("value split", before, "|", lastWord);
  return [before, lastWord];
};

export default function Filter(props) {
  const theme = useTheme();
  const cols = Array.from(props.cols);

  const [tempFeature, setTempFeature] = useState("");
  const [tempRelation, setTempRelation] = useState("");
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    setTempFeature(props.feature);
  }, [props.feature]);

  useEffect(() => {
    setTempRelation(props.relation);
    // alert("new props.relation", props.relation);
  }, [props.relation]);

  useEffect(() => {
    setTempValue(props.value);
  }, [props.value]);

  console.log("tempRelation is", tempRelation);

  const relations = [
    "=",
    ">",
    "<",
    "≥",
    "≤",
    "≠",
    "starts with",
    "ends with",
    "contains",
    "excludes",
    "exists",
  ];
  const relationsSet = new Set(relations);
  const relationMap = {
    "==": "=",
    ">=": "≥",
    "=>": "≥",
    "<=": "≤",
    "=<": "≤",
    "!=": "≠",
    "=!": "≠",
    "<>": "≠",
  };

  const filterOptions = (options, { inputValue }) => {
    const [before, lastWord] = splitValue(inputValue, cols);
    return cols.filter((element) => {
      return (
        element.toLowerCase().startsWith(lastWord.toLowerCase()) &&
        element.length >= lastWord.length
      );
    });
  };

  console.log("row props", props);
  return (
    <div className={styles.row} style={props.style}>
      <Autocomplete
        disablePortal
        options={cols.map((col) => {
          return {
            label: col,
          };
        })}
        sx={{
          width: 220,
        }}
        defaultValue={props.feature}
        onChange={(e) => {
          setTempFeature(e.target.innerText);
          props.onChange({ feature: e.target.innerText });
        }}
        disableClearable
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="Feature"
            error={!props.cols.has(tempFeature)}
            variant="standard"
            value={tempFeature}
            onChange={(e) => {
              if (props.cols.has(e.target.value)) {
                props.onChange({ feature: e.target.value });
              }
              setTempFeature(e.target.value);
            }}
          />
        )}
      />
      <Autocomplete
        // disablePortal
        freeSolo
        filterOptions={(options, { inputValue }) => {
          const starters = Object.keys(relationMap)
            .filter((key) => {
              return key.indexOf(inputValue) > -1;
            })
            .map((key) => relationMap[key]);
          const exact = relations.filter((element) => {
            return !inputValue || element.includes(inputValue.toLowerCase());
          });
          return Array.from(new Set([...starters, ...exact]));
        }}
        options={relations.map((col) => {
          return {
            label: col,
          };
        })}
        onChange={(e) => {
          props.onChange({
            relation: e.target.innerText,
          });
          setTempRelation(e.target.innerText);
        }}
        value={tempRelation}
        sx={{ width: 100 }}
        disableClearable
        renderInput={(params) => (
          <TextField
            {...params}
            label="Relation"
            variant="standard"
            error={!relationsSet.has(tempRelation)}
            value={tempRelation}
            onBlur={(e) => {
              if (relationMap[e.target.value]) {
                props.onChange({
                  relation: relationMap[e.target.value],
                });
                setTempRelation(relationMap[e.target.value]);
              }
            }}
            onChange={(e) => {
              if (relationsSet.has(e.target.value)) {
                props.onChange({
                  relation: e.target.value,
                });
                if (e.target.value == "exists") {
                  props.onChange({
                    valid: true,
                  });
                }
              }
              setTempRelation(e.target.value);
            }}
          />
        )}
      />
      <Autocomplete
        filterOptions={filterOptions}
        disablePortal
        options={cols.map((col) => {
          return {
            label: col,
          };
        })}
        onChange={(e) => {
          const newValue = splitValue(tempValue, cols)[0] + e.target.innerText;
          props.onChange({
            value: newValue,
            valid: errorMessage(newValue, cols, tempRelation) ? false : true,
          });
          setTempValue(newValue);
        }}
        disableClearable
        freeSolo
        style={{
          flex: 1,
        }}
        disabled={tempRelation == "exists"}
        renderInput={(params) => {
          delete params.inputProps.value;
          const message = errorMessage(tempValue, cols, tempRelation);
          return (
            <TextField
              {...params}
              error={message ? true : false}
              label={message || "Expression"}
              variant="standard"
              value={tempValue}
              disabled={tempRelation == "exists"}
              color={theme.palette.mode == "dark" ? "secondary" : "primary"}
              onChange={(e) => {
                props.onChange({
                  value: e.target.value,
                  valid: message ? false : true,
                });
                setTempValue(e.target.value);
              }}
            />
          );
        }}
      />
      {props.showDelete ? (
        <DeleteIcon
          className={styles.deleteIcon}
          onClick={() => {
            props.onDelete();
          }}
          style={{
            color: theme.palette.error.main,
          }}
        />
      ) : null}
    </div>
  );
}
