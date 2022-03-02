import { useEffect, createContext, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const ThemeManager = createContext(undefined);

export { ThemeManager };

export default function Theme(props) {
  const envPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const [storedPrefersDark, setStoredPrefersDark] = useState(undefined);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      setStoredPrefersDark(stored == "dark");
    }
  }, []);

  const manuallyToggleTheme = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let newMode;
    if (storedPrefersDark === undefined) {
      newMode = !envPrefersDark;
    } else {
      newMode = !storedPrefersDark;
    }
    localStorage.setItem("theme", newMode ? "dark" : "light");
    setStoredPrefersDark(newMode);
  };

  const prefersDarkMode =
    storedPrefersDark === undefined ? envPrefersDark : storedPrefersDark;

  const theme = createTheme({
    typography: {
      fontFamily: "Rubik",
      button: {
        textTransform: "none",
        boxShadow: "none",
      },
    },
    palette: {
      mode: prefersDarkMode ? "dark" : "light",
      type: prefersDarkMode ? "dark" : "light",
      ...(prefersDarkMode
        ? {
            primary: {
              main: "#315ACF",
            },
            secondary: {
              main: "#ABC1FF",
            },
            error: {
              main: "#ff0000",
            },
            white: {
              main: "#FFFFFF",
            },
          }
        : {
            primary: {
              main: "#5179EA",
            },
            secondary: {
              main: "#ABC1FF",
            },
            error: {
              main: "#ff0000",
            },
            white: {
              main: "#FFFFFF",
            },
          }),
    },
    shadows: ["none"],
    shape: {
      borderRadius: 8,
    },
    overrides: {
      MuiInput: {
        root: {
          borderRadius: 0,
          backgroundColor: "#fff",
          border: "1px solid pink",
          fontSize: 16,
          padding: "10px 12px",
          width: "calc(100% - 24px)",
        },
      },
    },
  });

  // console.log("theme at creation", theme);

  useEffect(() => {
    if (prefersDarkMode) {
      // document.body.style.backgroundColor = "#0E1723";
      document.body.classList.add("dark-mode");
    } else {
      // document.body.style.backgroundColor = "#fff";
      document.body.classList.remove("dark-mode");
    }
  }, [prefersDarkMode]);

  return (
    <ThemeManager.Provider value={manuallyToggleTheme}>
      <ThemeProvider
        theme={theme}
        className={prefersDarkMode ? "dark-mode" : "light-mode"}
      >
        {props.children}
      </ThemeProvider>
    </ThemeManager.Provider>
  );
}
