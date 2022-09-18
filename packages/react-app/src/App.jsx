import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Router from "./Router";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

import EthersProvider from "./services/ethers/index";
import ContractUsdc from "./services/usdc/index";
import ContractDank from "./services/contract/index";

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

const USER_ADDRESS = "";
const USER_PRIVATE_KEY = "";

const App = () => {
  const initProvider = () => {
    const prov = new EthersProvider();
    prov.init();
    console.log({ prov });
  };

  const sendUsdc = () => {
    const prov = new EthersProvider();
    prov.init();
    console.log({ prov });

    const usdcContract = new ContractUsdc("0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e", prov.provider);
    console.log(usdcContract.contractAddress);
  };

  const registerUser = async () => {
    const prov = new EthersProvider();
    prov.init();
    console.log({ prov });

    console.log("1");

    const dankContract = new ContractDank("0x6a05A1eC1A33E2a3525254ce6E59E09822B67351", prov.provider);

    console.log("2");

    const data = await dankContract.registerUser(
      USER_ADDRESS,
      "firstUsername2",
      USER_ADDRESS,
      "IPFS_URL_2",
      USER_PRIVATE_KEY,
    );

    console.log("3");

    console.log({ data });
  };

  const getUser = async () => {
    const prov = new EthersProvider();
    prov.init();
    console.log({ prov });

    const dankContract = new ContractDank("0x6a05A1eC1A33E2a3525254ce6E59E09822B67351", prov.provider);

    const data = await dankContract.createTxn("getUser", ["firstUsername2"], USER_ADDRESS);

    console.log({ data });

    const txData = await dankContract.signAndSendTxn(data, USER_PRIVATE_KEY);

    console.log({ txData });
  };

  const readData = async () => {
    const prov = new EthersProvider();
    prov.init();
    console.log({ prov });

    const dankContract = new ContractDank("0x6a05A1eC1A33E2a3525254ce6E59E09822B67351", prov.provider);

    const data = await dankContract.getViews("getUser", ["firstUsername"]);

    console.log({ data });
  };

  console.log(darkTheme);
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container fixed>
        <Button
        // onClick={() => {
        //   console.log("APLE");
        //   initProvider();
        // }}
        >
          <div
            onClick={() => {
              initProvider();
            }}
          >
            Init provider
          </div>
        </Button>
        <Button>
          <div onClick={sendUsdc}>send USDC</div>
        </Button>

        <Button>
          <div onClick={registerUser}>register user</div>
        </Button>

        <Button>
          <div onClick={getUser}>Get user</div>
        </Button>

        <Button>
          <div onClick={readData}>Read user data</div>
        </Button>

        <Router />
      </Container>
    </ThemeProvider>
  );
};

export default App;
