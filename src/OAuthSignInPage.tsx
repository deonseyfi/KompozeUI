import * as React from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

// Fake sign-in handler
const handleSignIn = (provider: string) => {
  console.log(`Sign in with ${provider}`);
};

// Theme with white text + orange styling (no font override needed)
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#FFA500" },
    text: { primary: "#FFFFFF", secondary: "#FFFFFF" },
    background: { default: "#000", paper: "#000" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
          borderColor: "#FFA500",
          textTransform: "none",
          fontWeight: 600,
          "&:hover": {
            backgroundColor: "#1a1a1a",
            borderColor: "#FFA500",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#000",
          border: "1px solid #FFA500",
          boxShadow: "none",
        },
      },
    },
  },
});

export default function OAuthSignInPage() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          position: "fixed",
          top: 96,
          right: 32,
          zIndex: 1300,
          pointerEvents: "auto",
          fontFamily: "inherit", // ✅ use body style
        }}
      >
        <Paper
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 340,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Sign in
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Welcome user, please sign in to continue
          </Typography>

          <Stack spacing={2} width="100%">
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={() => handleSignIn("Google")}
            >
              Sign In With Google
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<TwitterIcon />}
              onClick={() => handleSignIn("Twitter")}
            >
              Sign In With Twitter
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<LinkedInIcon />}
              onClick={() => handleSignIn("LinkedIn")}
            >
              Sign In With LinkedIn
            </Button>
          </Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
