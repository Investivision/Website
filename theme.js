import { createTheme } from "@mui/material/styles";

export default createTheme({
  typography: {
    fontFamily: "Rubik",
    button: {
      textTransform: "none",
      boxShadow: "none",
    },
  },
  palette: {
    type: "light",
    primary: {
      main: "#5179EA",
    },
    secondary: {
      main: "#ABC1FF",
    },
    error: {
      main: "#ff0000",
    },
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

/*

return createTheme({
      typography: {
        fontFamily: "Rubik",
        button: {
          textTransform: "none",
          boxShadow: "none",
        },
      },
      palette: {
        type: prefersDarkMode ? "dark" : "light",
        ...(prefersDarkMode
          ? {}
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

    */
