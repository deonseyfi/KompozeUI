import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  Alert,
  Stack,
} from "@mui/material";
import {
  Close as CloseIcon,
  Google as GoogleIcon,
  Twitter as TwitterIcon,
} from "@mui/icons-material";
import { useAuth } from "./BackendAuthContext";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { login, register, loginWithGoogle, loginWithTwitter, resetPassword } =
    useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (isForgotPassword) {
        await resetPassword(email);
        setSuccessMessage("Password reset email sent! Check your inbox.");
      } else if (isSignUp) {
        await register(email, password, name);
        onClose();
        resetForm();
      } else {
        await login(email, password);
        onClose();
        resetForm();
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await loginWithGoogle();
      onClose();
      resetForm();
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTwitterLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await loginWithTwitter();
      onClose();
      resetForm();
    } catch (err: any) {
      console.error("Twitter login error:", err);
      setError(err.message || "Twitter login failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
    setSuccessMessage("");
    setIsForgotPassword(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setError("");
    setSuccessMessage("");
  };

  const getTitle = () => {
    if (isForgotPassword) return "Reset Password";
    return isSignUp ? "Create Account" : "Welcome Back";
  };

  const getButtonText = () => {
    if (loading) {
      if (isForgotPassword) return "Sending...";
      return isSignUp ? "Creating Account..." : "Signing In...";
    }
    if (isForgotPassword) return "Send Reset Email";
    return isSignUp ? "Create Account" : "Sign In";
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#1a1a1a",
          color: "white",
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ color: "white", fontWeight: 600 }}>
          {getTitle()}
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Social Login Buttons - Only show for login/signup, not forgot password */}
        {!isForgotPassword && (
          <>
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                disabled={loading}
                sx={{
                  borderColor: "#555",
                  color: "white",
                  py: 1.5,
                  "&:hover": {
                    borderColor: "#orange",
                    backgroundColor: "rgba(255, 102, 0, 0.1)",
                  },
                  "&:disabled": {
                    borderColor: "#333",
                    color: "#666",
                  },
                }}
              >
                Continue with Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<TwitterIcon />}
                onClick={handleTwitterLogin}
                disabled={loading}
                sx={{
                  borderColor: "#555",
                  color: "white",
                  py: 1.5,
                  "&:hover": {
                    borderColor: "#1DA1F2",
                    backgroundColor: "rgba(29, 161, 242, 0.1)",
                  },
                  "&:disabled": {
                    borderColor: "#333",
                    color: "#666",
                  },
                }}
              >
                Continue with Twitter
              </Button>
            </Stack>

            <Divider sx={{ my: 2, borderColor: "#555" }}>
              <Typography variant="body2" sx={{ color: "#ccc" }}>
                OR
              </Typography>
            </Divider>
          </>
        )}

        {/* Email/Password Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, backgroundColor: "#d32f2f" }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert
              severity="success"
              sx={{ mb: 2, backgroundColor: "#2e7d32" }}
            >
              {successMessage}
            </Alert>
          )}

          {/* Forgot Password Form */}
          {isForgotPassword ? (
            <>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 2 }}>
                Enter your email address and we'll send you a link to reset your
                password.
              </Typography>

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#2d2d2d",
                    color: "white",
                    "& fieldset": { borderColor: "#555" },
                    "&:hover fieldset": { borderColor: "#orange" },
                    "&.Mui-focused fieldset": { borderColor: "#orange" },
                  },
                  "& .MuiInputLabel-root": { color: "#ccc" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#orange" },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mb: 2,
                  backgroundColor: "#ff6600",
                  color: "white",
                  fontWeight: 600,
                  py: 1.5,
                  "&:hover": { backgroundColor: "#e55a00" },
                  "&:disabled": { backgroundColor: "#555" },
                }}
              >
                {getButtonText()}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  variant="text"
                  onClick={handleBackToLogin}
                  disabled={loading}
                  sx={{ color: "#orange", textTransform: "none" }}
                >
                  ← Back to Sign In
                </Button>
              </Box>
            </>
          ) : (
            /* Regular Login/Signup Form */
            <>
              {isSignUp && (
                <TextField
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#2d2d2d",
                      color: "white",
                      "& fieldset": { borderColor: "#555" },
                      "&:hover fieldset": { borderColor: "#orange" },
                      "&.Mui-focused fieldset": { borderColor: "#orange" },
                    },
                    "& .MuiInputLabel-root": { color: "#ccc" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#orange" },
                  }}
                />
              )}

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#2d2d2d",
                    color: "white",
                    "& fieldset": { borderColor: "#555" },
                    "&:hover fieldset": { borderColor: "#orange" },
                    "&.Mui-focused fieldset": { borderColor: "#orange" },
                  },
                  "& .MuiInputLabel-root": { color: "#ccc" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#orange" },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#2d2d2d",
                    color: "white",
                    "& fieldset": { borderColor: "#555" },
                    "&:hover fieldset": { borderColor: "#orange" },
                    "&.Mui-focused fieldset": { borderColor: "#orange" },
                  },
                  "& .MuiInputLabel-root": { color: "#ccc" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#orange" },
                }}
              />

              {/* Forgot Password Link - Only show on Sign In */}
              {!isSignUp && (
                <Box sx={{ textAlign: "right", mb: 2 }}>
                  <Button
                    variant="text"
                    onClick={() => setIsForgotPassword(true)}
                    disabled={loading}
                    sx={{
                      color: "#orange",
                      textTransform: "none",
                      p: 0,
                      minWidth: "auto",
                      fontSize: "0.875rem",
                    }}
                  >
                    Forgot Password?
                  </Button>
                </Box>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mb: 2,
                  backgroundColor: "#ff6600",
                  color: "white",
                  fontWeight: 600,
                  py: 1.5,
                  "&:hover": { backgroundColor: "#e55a00" },
                  "&:disabled": { backgroundColor: "#555" },
                }}
              >
                {getButtonText()}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" sx={{ color: "#ccc" }}>
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                  <Button
                    variant="text"
                    onClick={() => setIsSignUp(!isSignUp)}
                    disabled={loading}
                    sx={{
                      color: "#orange",
                      textTransform: "none",
                      p: 0,
                      minWidth: "auto",
                    }}
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </Button>
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
