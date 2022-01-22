import { useTheme } from "@mui/styles";
import styles from "./filter.module.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import DeleteIcon from "@material-ui/icons/DeleteForeverRounded";

const errorMessage = (value, cols) => {
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
  if (/[a-zA-Z]/g.test(value)) {
    return "Misspelled column";
  }
  try {
    eval(value);
  } catch (e) {
    return "Expression error";
  }
  return undefined;
};

export default function Filter(props) {
  const theme = useTheme();
  const cols = Array.from(props.cols);

  const relations = ["=", ">", "<", "≥", "≤", "≠"];
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
    inputValue = inputValue.replaceAll(", ", ",").replaceAll(" %", "%");
    let start = 0;
    for (let i = inputValue.length - 1; i >= 0; i--) {
      const char = inputValue.charAt(i);
      if (!(/[a-zA-Z]/.test(char) || char == "," || char == "%")) {
        start = i + 1;
        break;
      }
    }

    const lastWord = inputValue
      .substring(start)
      .replaceAll(",", ", ")
      .replaceAll("%", " %");
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
          props.onChange({ feature: e.target.innerText });
        }}
        disableClearable
        renderInput={(params) => (
          <TextField
            {...params}
            label="Feature"
            variant="standard"
            defaultValue={props.feature}
            onChange={(e) => {
              if (props.cols.has(e.target.value)) {
                props.onChange({ feature: e.target.value });
              }
            }}
          />
        )}
      />
      <Autocomplete
        // disablePortal
        autoSelect
        filterOptions={(options, { inputValue }) => {
          const starters = Object.keys(relationMap)
            .filter((key) => {
              return key.indexOf(inputValue) > -1;
            })
            .map((key) => relationMap[key]);
          const exact = relations.filter((element) => {
            return !inputValue || element == inputValue;
          });
          return Array.from(new Set(starters.concat(exact)));
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
        }}
        defaultValue={props.relation}
        sx={{ width: 70 }}
        disableClearable
        renderInput={(params) => (
          <TextField
            {...params}
            label="Relation"
            variant="standard"
            defaultValue={props.relation}
            onBlur={(e) => {
              console.log("filters blur", e.target.value);
              if (relationMap[e.target.value]) {
                console.log(
                  "filters using rel map",
                  relationMap[e.target.value]
                );
                props.onChange({
                  relation: relationMap[e.target.value],
                });
              } else if (relations.includes(e.target.value)) {
                console.log("using exact targets");
                props.onChange({
                  relation: e.target.value,
                });
              }
            }}
            onChange={(e) => {
              if (relations.includes(e.target.value)) {
                props.onChange({
                  relation: e.target.value,
                });
              }
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
          props.onChange({
            value: props.value
              .split(" ")
              .slice(0, -1)
              .concat([e.target.innerText])
              .join(" "),
          });
        }}
        disableClearable
        freeSolo
        style={{
          flex: 1,
        }}
        renderInput={(params) => {
          delete params.inputProps.value;
          const message = errorMessage(props.value, cols);
          return (
            <TextField
              {...params}
              error={message ? true : false}
              label={message || "Expression"}
              variant="standard"
              defaultValue={props.value}
              color={theme.palette.mode == "dark" ? "secondary" : "primary"}
              onChange={(e) => {
                console.log("text field change", e.target.value);
                props.onChange({
                  value: e.target.value,
                  valid: message ? false : true,
                });
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
