import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ethers } from "ethers";
import { uploadToIPFS, retrieveFromIPFS } from "../services/ipfs";

const AuthTypes = {
  LOGIN: "Login",
  CREATE: "Create",
};

const CreateStages = {
  USERNAME: "Username",
  PASSWORD: "Password",
  PIN: "Pin",
};

const AuthPage = () => {
  const [authType, setAuthType] = useState(AuthTypes.LOGIN);
  const { breakpoints } = useTheme();
  const showImage = useMediaQuery(breakpoints.up("md"));
  const removePadding = useMediaQuery(breakpoints.down("sm"));

  const [createStage, setCreateStage] = useState(CreateStages.USERNAME);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(true);

  const handleCreateUsername = () => {
    setCreateStage(CreateStages.PASSWORD);
  };

  const handleCreatePassword = () => {
    setCreateStage(CreateStages.PIN);
  };

  const handleCreateUser = async () => {
    setLoading(true);
    console.log("handleCreateUser");
    const account = ethers.Wallet.createRandom();
    const encWallet = JSON.parse(await account.encrypt(`${password}-${pin}`));
    const data = await uploadToIPFS({ publicAddress: account.publicKey, privateData: encWallet });
    setLoading(false);
    console.log(data);
  };

  const handleLogin = async () => {
    const data = await retrieveFromIPFS(
      "https://spheron.infura-ipfs.io/ipfs/bafybeiahxba4k2fe4yxa4prkk7tnaux2o4mauaqweovazllz52p6rghlqq/0x04549d641baf10af02548fc8187abd92ff1ea8d9f0037a8b16c4a9a940673dd6012b1392f587e04fe78906ee3dc7772127ad6d50387df23e030ecc1c23e2cc960c.json",
    );
    console.log(data);
    const wallet = ethers.Wallet.fromEncryptedJsonSync(JSON.stringify(data.privateData), `${password}-${pin}`);
    console.log(wallet.publicKey);
  };

  return (
    <Box
      sx={{
        marginTop: "112px",
        paddingLeft: removePadding ? "16px" : "64px",
        paddingRight: removePadding ? "16px" : "64px",
      }}
    >
      <Grid container spacing={23}>
        <Grid item md={6} xs={12}>
          <Typography variant="h4" component="h4" sx={{ fontWeight: "medium", marginBottom: "42px" }}>
            Dank Wallet
          </Typography>
          <Stack direction="row" spacing={3} sx={{ marginBottom: "56px" }}>
            <Button
              onClick={() => {
                setAuthType(AuthTypes.LOGIN);
                setCreateStage(CreateStages.USERNAME);
                setUsername("");
                setPassword("");
                setConfirmPassword("");
                setPin("");
                setConfirmPin("");
              }}
              style={{
                backgroundColor: authType === AuthTypes.LOGIN ? "#27282A" : "#1D1E20",
              }}
              sx={{
                fontSize: "18px",
                backgroundColor: authType === AuthTypes.LOGIN ? "#27282A" : "#1D1E20",
                padding: "8px 18px",
                color: "#FFFFFF",
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setAuthType(AuthTypes.CREATE);
                setCreateStage(CreateStages.USERNAME);
                setUsername("");
                setPassword("");
                setConfirmPassword("");
                setPin("");
                setConfirmPin("");
              }}
              style={{
                backgroundColor: authType === AuthTypes.CREATE ? "#27282A" : "#1D1E20",
              }}
              sx={{
                fontSize: "18px",
                padding: "8px 18px",
                color: "#FFFFFF",
              }}
            >
              Create
            </Button>
          </Stack>

          <Stack spacing={5} sx={{ width: "100%" }}>
            {authType === AuthTypes.LOGIN ? (
              <>
                <TextField
                  id="username"
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
                <TextField
                  id="password"
                  label="Password"
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <TextField
                  id="pin"
                  label="pin"
                  variant="outlined"
                  type="number"
                  length="4"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                />
                <Button
                  sx={{ height: "48px" }}
                  variant="contained"
                  disabled={!username || !password || !pin}
                  onClick={handleLogin}
                >
                  LOGIN
                </Button>
              </>
            ) : (
              <>
                {createStage === CreateStages.USERNAME && (
                  <>
                    <TextField
                      id="username"
                      label="Username"
                      variant="outlined"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                    />
                    <Button
                      sx={{ height: "48px" }}
                      variant="contained"
                      disabled={!username}
                      onClick={handleCreateUsername}
                    >
                      CREATE
                    </Button>
                  </>
                )}
                {createStage === CreateStages.PASSWORD && (
                  <>
                    <TextField
                      id="password"
                      label="Password"
                      variant="outlined"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <TextField
                      id="confirm-password"
                      label="Confirm Password"
                      variant="outlined"
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <Button
                      sx={{ height: "48px" }}
                      variant="contained"
                      disabled={!password || !confirmPassword || password !== confirmPassword}
                      onClick={handleCreatePassword}
                    >
                      CREATE
                    </Button>
                  </>
                )}
                {createStage === CreateStages.PIN && (
                  <>
                    <TextField
                      id="pin"
                      label="pin"
                      variant="outlined"
                      type="number"
                      length="4"
                      value={pin}
                      onChange={e => setPin(e.target.value)}
                    />
                    <TextField
                      id="confirm-pin"
                      label="Confirm pin"
                      variant="outlined"
                      type="number"
                      length="4"
                      value={confirmPin}
                      onChange={e => setConfirmPin(e.target.value)}
                    />
                    <Button
                      loading={loading}
                      sx={{ height: "48px" }}
                      variant="contained"
                      disabled={
                        !pin || pin.length !== 4 || !confirmPin || confirmPin.length !== 4 || pin !== confirmPin
                      }
                      onClick={handleCreateUser}
                    >
                      CREATE
                    </Button>
                  </>
                )}
              </>
            )}
          </Stack>
        </Grid>
        {showImage && (
          <Grid item md={6} xs={0}>
            <img src={"./assets/AuthSVG.svg"} style={{ width: "100%", height: "100%" }} alt="onboarding-svg" />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AuthPage;
