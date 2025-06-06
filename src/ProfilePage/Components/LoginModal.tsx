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
import { useAuth } from "./BackendAuthContext"; // Keep the same import

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
        setSuccessMessage(
          "Account created! Please check your email to verify your account."
        );
        // Don't close modal immediately for signup - let them see the success message
        setTimeout(() => {
          onClose();
          resetForm();
        }, 2000);
      } else {
        await login(email, password);
        onClose();
        resetForm();
      }
    } catch (err: any) {
      console.error("Auth error:", err);

      // Handle common Firebase auth errors with user-friendly messages
      let errorMessage = err.message;
      if (err.message.includes("user-not-found")) {
        errorMessage = "No account found with this email address.";
      } else if (err.message.includes("wrong-password")) {
        errorMessage = "Incorrect password. Please try again.";
      } else if (err.message.includes("email-already-in-use")) {
        errorMessage = "An account with this email already exists.";
      } else if (err.message.includes("weak-password")) {
        errorMessage = "Password should be at least 6 characters long.";
      } else if (err.message.includes("invalid-email")) {
        errorMessage = "Please enter a valid email address.";
      } else if (err.message.includes("too-many-requests")) {
        errorMessage = "Too many failed attempts. Please try again later.";
      }

      setError(errorMessage);
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
      let errorMessage = err.message;
      if (err.message.includes("popup-closed-by-user")) {
        errorMessage = "Sign-in was cancelled.";
      } else if (err.message.includes("popup-blocked")) {
        errorMessage = "Please allow popups for this site and try again.";
      }
      setError(errorMessage);
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
      let errorMessage = err.message;
      if (err.message.includes("popup-closed-by-user")) {
        errorMessage = "Sign-in was cancelled.";
      } else if (err.message.includes("popup-blocked")) {
        errorMessage = "Please allow popups for this site and try again.";
      }
      setError(errorMessage);
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
    return isSignUp ? "Create Account" : "Login";
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
          background: "rgba(30, 30, 30, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          color: "#FFFFFF",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.8)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background:
            "linear-gradient(135deg, rgba(40, 40, 40, 0.8), rgba(20, 20, 20, 0.9))",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#FFFFFF",
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          {getTitle()}
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            "&:hover": {
              color: "#FFFFFF",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: "32px 24px 24px 24px" }}>
        {/* Social Login Buttons - Only show for login/signup, not forgot password */}
        {!isForgotPassword && (
          <>
            <Stack spacing={2} sx={{ mb: 3, mt: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                disabled={loading}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: "rgba(255, 255, 255, 0.9)",
                  py: 1.5,
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "orange",
                    backgroundColor: "rgba(255, 165, 0, 0.1)",
                    color: "#FFFFFF",
                  },
                  "&:disabled": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    color: "rgba(255, 255, 255, 0.4)",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
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
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: "rgba(255, 255, 255, 0.9)",
                  py: 1.5,
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#1DA1F2",
                    backgroundColor: "rgba(29, 161, 242, 0.1)",
                    color: "#FFFFFF",
                  },
                  "&:disabled": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    color: "rgba(255, 255, 255, 0.4)",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                  },
                }}
              >
                Continue with Twitter
              </Button>
            </Stack>

            <Divider sx={{ my: 2, borderColor: "rgba(255, 255, 255, 0.1)" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "13px",
                }}
              >
                OR
              </Typography>
            </Divider>
          </>
        )}

        {/* Email/Password Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                backgroundColor: "rgba(211, 47, 47, 0.15)",
                border: "1px solid rgba(211, 47, 47, 0.3)",
                borderRadius: "8px",
                color: "#ff6b6b",
                "& .MuiAlert-icon": {
                  color: "#ff6b6b",
                },
              }}
            >
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert
              severity="success"
              sx={{
                mb: 2,
                backgroundColor: "rgba(46, 125, 50, 0.15)",
                border: "1px solid rgba(46, 125, 50, 0.3)",
                borderRadius: "8px",
                color: "#4caf50",
                "& .MuiAlert-icon": {
                  color: "#4caf50",
                },
              }}
            >
              {successMessage}
            </Alert>
          )}

          {/* Forgot Password Form */}
          {isForgotPassword ? (
            <>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  mb: 2,
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
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
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 165, 0, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "orange",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.6)",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "orange",
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mb: 2,
                  backgroundColor: "orange",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "14px",
                  letterSpacing: "0.01em",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#e55a00",
                    boxShadow: "0 4px 12px rgba(255, 165, 0, 0.3)",
                  },
                  "&:disabled": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "rgba(255, 255, 255, 0.4)",
                  },
                }}
              >
                {getButtonText()}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  variant="text"
                  onClick={handleBackToLogin}
                  disabled={loading}
                  sx={{
                    color: "orange",
                    textTransform: "none",
                    fontSize: "14px",
                    "&:hover": {
                      backgroundColor: "rgba(255, 165, 0, 0.08)",
                    },
                  }}
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
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      color: "#FFFFFF",
                      borderRadius: "8px",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 165, 0, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "orange",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.6)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "orange",
                    },
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
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 165, 0, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "orange",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.6)",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "orange",
                  },
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
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 165, 0, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "orange",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.6)",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "orange",
                  },
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
                      color: "orange",
                      textTransform: "none",
                      p: 0,
                      minWidth: "auto",
                      fontSize: "14px",
                      "&:hover": {
                        backgroundColor: "rgba(255, 165, 0, 0.08)",
                      },
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
                  backgroundColor: "orange",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "14px",
                  letterSpacing: "0.01em",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#e55a00",
                    boxShadow: "0 4px 12px rgba(255, 165, 0, 0.3)",
                  },
                  "&:disabled": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "rgba(255, 255, 255, 0.4)",
                  },
                }}
              >
                {getButtonText()}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "14px",
                  }}
                >
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                  <Button
                    variant="text"
                    onClick={() => setIsSignUp(!isSignUp)}
                    disabled={loading}
                    sx={{
                      color: "orange",
                      textTransform: "none",
                      p: 0,
                      minWidth: "auto",
                      fontSize: "14px",
                      "&:hover": {
                        backgroundColor: "rgba(255, 165, 0, 0.08)",
                      },
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
