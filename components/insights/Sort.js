import { useTheme } from "@mui/styles";
import styles from "./filter.module.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import DeleteIcon from "@material-ui/icons/DeleteForeverRounded";

export default function Filter(props) {
  const theme = useTheme();
  const cols = Array.from(props.cols);

  const directions = ["Asc", "Desc"];

  console.log("sort row props", props);
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
        value={props.attr}
        onChange={(e) => {
          props.onChange({ attr: e.target.innerText });
        }}
        disableClearable
        renderInput={(params) => (
          <TextField
            {...params}
            label="Feature"
            variant="standard"
            value={props.attr}
            onChange={(e) => {
              if (props.cols.has(e.target.value)) {
                props.onChange({ attr: e.target.value });
              }
            }}
          />
        )}
      />
      <Autocomplete
        // disablePortal
        autoSelect
        options={directions.map((dir) => {
          return {
            label: dir,
          };
        })}
        onChange={(e) => {
          props.onChange({
            dir: e.target.innerText,
          });
        }}
        value={props.dir}
        sx={{ width: 90 }}
        disableClearable
        renderInput={(params) => (
          <TextField
            {...params}
            label="Direction"
            variant="standard"
            value={props.dir}
            onChange={(e) => {
              if (directions.includes(e.target.value)) {
                props.onChange({
                  dir: e.target.value,
                });
              }
            }}
          />
        )}
      />
    </div>
  );
}
