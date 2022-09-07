import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

const AuthTypes = {
  LOGIN: "Login",
  CREATE: "Create",
};

const AuthPage = () => {
  const [authType, setAuthType] = useState(AuthTypes.LOGIN);

  return (
    <Box sx={{ marginTop: "112px" }}>
      <Typography variant="h4" component="h4" sx={{ fontWeight: "medium", marginBottom: "42px" }}>
        Dank Wallet
      </Typography>
      <Stack direction="row" spacing={3} sx={{ marginBottom: "56px" }}>
        <Button
          onClick={() => setAuthType(AuthTypes.LOGIN)}
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
      <Stack spacing={5}>
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
            <TextField id="username" label="Username" variant="outlined" />
            <TextField id="password" label="Password" variant="outlined" />
            <Button sx={{ height: "48px" }} variant="contained">
              CREATE
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default AuthPage;
