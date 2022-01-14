import { useTheme } from "@mui/styles";
import styles from "./filter.module.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import DeleteIcon from "@material-ui/icons/DeleteForeverRounded";

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
    const lastWord = inputValue.split(" ").pop();
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
        value={props.feature}
        onChange={(e) => {
          props.onChange({ feature: e.target.innerText });
        }}
        disableClearable
        renderInput={(params) => (
          <TextField
            {...params}
            label="Feature"
            variant="standard"
            value={props.feature}
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
        value={props.relation}
        sx={{ width: 70 }}
        disableClearable
        renderInput={(params) => (
          <TextField
            {...params}
            label="Relation"
            variant="standard"
            value={props.relation}
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
        sx={{ width: 200 }}
        disableClearable
        freeSolo
        renderInput={(params) => {
          delete params.inputProps.value;
          return (
            <TextField
              {...params}
              label="Expression"
              variant="standard"
              value={props.value}
              onChange={(e) => {
                console.log("text field change", e.target.value);
                props.onChange({
                  value: e.target.value,
                });
              }}
            />
          );
        }}
      />
      <DeleteIcon
        className={styles.deleteIcon}
        onClick={() => {
          props.onDelete();
        }}
        style={{
          color: theme.palette.error.main,
        }}
      />
    </div>
  );
}
