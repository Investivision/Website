import { useTheme } from "@mui/styles";
import styles from "./filter.module.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import DeleteIcon from "@material-ui/icons/DeleteForeverRounded";

const illegalChars = ["=", ","];

const errorMessage = (value, cols, relation) => {
  if (!value && relation != "exists") {
    return "Missing Expression";
  }

  for (const col of cols) {
    value = value.replace(col, "123");
  }

  let inQuote = false;
  for (var i = 0; i < value.length; i++) {
    const char = value.charAt(i);
    for (const illegal of illegalChars) {
      if (char == illegal) {
        return "Illegal Character " + char;
      }
    }
    if (char == '"') {
      inQuote = !inQuote;
    } else if (!inQuote && /[a-zA-Z]/g.test(char)) {
      return "Use quotes around text";
    }
  }

  // if (/[a-zA-Z]/g.test(value)) {
  //   return "Use quotes around text";
  // }

  try {
    eval(value);
  } catch (e) {
    return "Expression Error";
  }
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
    let out = [];
    let bestLen = 1;
    while (
      inputValue.length > bestLen &&
      inputValue.charAt(inputValue.length - bestLen - 1).match(/[a-z]/i)
    ) {
      bestLen++;
    }
    console.log("filter pattern initial is", bestLen);
    inputValue = inputValue.toLowerCase();
    for (let col of cols) {
      // console.log("filter pattern try col", col);
      for (let i = bestLen; i <= Math.min(col.length, inputValue.length); i++) {
        if (
          col
            .toLowerCase()
            .startsWith(inputValue.substring(inputValue.length - i))
        ) {
          if (i > bestLen) {
            console.log("filter pattern new best", col, i);
            bestLen = i;
            out = [col];
          } else {
            console.log("filter pattern", col);
            out.push(col);
          }
        }
      }
    }
    return out;
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
          const col = e.target.innerText;

          for (
            let i = tempValue.length - col.length;
            i < tempValue.length;
            i++
          ) {
            if (
              col.toLowerCase().startsWith(tempValue.substring(i).toLowerCase())
            ) {
              const newValue = tempValue.substring(0, i) + col;
              props.onChange({
                value: newValue,
                valid: errorMessage(newValue, cols, tempRelation)
                  ? false
                  : true,
              });
              setTempValue(newValue);
              break;
            }
          }
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
              label={message || "Expression, other Column"}
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
