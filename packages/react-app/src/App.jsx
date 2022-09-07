import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Router from "./Router";
import Container from "@mui/material/Container";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      paper: "#1D1E20",
      default: "#1D1E20",
    },
  },
});

const App = () => {
  console.log(darkTheme);
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container fixed>
        <Router />
      </Container>
    </ThemeProvider>
  );
};

export default App;
