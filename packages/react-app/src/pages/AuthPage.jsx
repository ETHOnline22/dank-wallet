import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

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
              onClick={() => setAuthType(AuthTypes.CREATE)}
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
                <TextField id="username" label="Username" variant="outlined" />
                <TextField id="password" label="Password" variant="outlined" />
                <Button sx={{ height: "48px" }} variant="contained">
                  LOGIN
                </Button>
              </>
            ) : (
              <>
                {createStage === CreateStages.USERNAME && (
                  <>
                    <TextField id="username" label="Username" variant="outlined" />
                    <Button sx={{ height: "48px" }} variant="contained">
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
