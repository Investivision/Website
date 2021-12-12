import Brightness4Icon from "@material-ui/icons/Brightness3Rounded";
import Brightness7Icon from "@material-ui/icons/Brightness7Rounded";
import IconButton from "@mui/material/IconButton";
import { ThemeManager } from "../../pages/Theme";
import { useContext } from "react";
import { useTheme } from "@mui/styles";

export default function ThemeToggle(props) {
  const theme = useTheme();

  const manuallyToggleTheme = useContext(ThemeManager);

  return (
    <IconButton onClick={manuallyToggleTheme} style={props.style}>
      {theme.palette.mode === "dark" ? (
        <Brightness7Icon
          style={{
            height: 18,
            width: 18,
          }}
        />
      ) : (
        <Brightness4Icon
          style={{
            height: 18,
            width: 18,
          }}
        />
      )}
    </IconButton>
  );
}
