import React, { useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Router from "./Router";
import Container from "@mui/material/Container";

import getWeb3 from "./getWeb3";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      paper: "#1D1E20",
      default: "#1D1E20",
    },
    primary: {
      main: "#1E7ADF",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

const App = () => {
  useEffect(() => {
    // const initializeWeb3 = async () => {
    //   const { web3, web3Biconomy, biconomy } = await getWeb3();
    //   biconomy
    //     .onEvent(biconomy.READY, async () => {
    //       // Handle web3 events inside this or after biconomy.READY
    //     })
    //     .onEvent(biconomy.ERROR, (error, message) => {
    //       // Handle error while initializing mexa
    //       console.log(error);
    //     });
    // };
    // initializeWeb3();
  });

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
