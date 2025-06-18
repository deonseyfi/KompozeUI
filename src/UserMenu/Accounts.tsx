import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../ProfilePage/Components/BackendAuthContext";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AccountPage = () => {
  const { user } = useAuth();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange =
    (field: keyof PasswordData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordData({ ...passwordData, [field]: event.target.value });
      setPasswordError("");
    };

  const handlePasswordSubmit = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    setPasswordDialogOpen(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleEmailSubmit = () => {
    // TODO: Implement email change
    setEmailDialogOpen(false);
    setNewEmail("");
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    setDeleteDialogOpen(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        minHeight: "100vh",
        py: 4,
        px: 2, // Match AppBar Toolbar padding directly
      }}
    >
      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Left Sidebar */}
        <Box sx={{ width: 280 }}>
          <Typography
            variant="h5"
            sx={{ color: "white", fontWeight: 600, mb: 3 }}
          >
            Account Details
          </Typography>

          <List sx={{ p: 0 }}>
            <ListItem disablePadding>
              <ListItemButton
                selected
                sx={{
                  borderLeft: "3px solid orange",
                  backgroundColor: "rgba(255, 165, 0, 0.1)",
                  "&.Mui-selected": {
                    backgroundColor: "rgba(255, 165, 0, 0.1)",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255, 165, 0, 0.15)",
                  },
                }}
              >
                <ListItemText
                  primary="Login and Security"
                  primaryTypographyProps={{
                    sx: { color: "white", fontWeight: 500 },
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                }}
              >
                <ListItemText
                  primary="Manage Subscription"
                  primaryTypographyProps={{
                    sx: { color: "rgba(255, 255, 255, 0.7)" },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            sx={{ color: "white", fontWeight: 600, mb: 4 }}
          >
            Login and Security
          </Typography>

          <Paper
            sx={{
              backgroundColor: "rgba(26, 26, 26, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 2,
              p: 0,
              overflow: "hidden",
            }}
          >
            {/* Email Section */}
            <Box sx={{ p: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ color: "white", fontWeight: 600, mb: 1 }}
              >
                Email
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  {user?.email || "user@example.com"}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setEmailDialogOpen(true)}
                  sx={{
                    color: "white",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "orange",
                      backgroundColor: "rgba(255, 165, 0, 0.1)",
                    },
                  }}
                >
                  Change Email
                </Button>
              </Box>
            </Box>

            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

            {/* Password Section */}
            <Box sx={{ p: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ color: "white", fontWeight: 600, mb: 1 }}
              >
                Password
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                >
                  Update your password and secure your account.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setPasswordDialogOpen(true)}
                  sx={{
                    color: "white",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "orange",
                      backgroundColor: "rgba(255, 165, 0, 0.1)",
                    },
                  }}
                >
                  Change Password
                </Button>
              </Box>
            </Box>

            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

            {/* Delete Account Section */}
            <Box sx={{ p: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ color: "white", fontWeight: 600, mb: 1 }}
              >
                Delete Account
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                >
                  This account will no longer be available, and all your saved
                  data will be permanently deleted.
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{
                    backgroundColor: "#d32f2f",
                    color: "white",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#b71c1c",
                    },
                  }}
                >
                  Delete Account
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "rgba(26, 26, 26, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            minWidth: "400px",
          },
        }}
      >
        <DialogTitle sx={{ color: "white" }}>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type={showCurrentPassword ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange("currentPassword")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      edge="end"
                      sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      {showCurrentPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "orange" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
            />

            <TextField
              fullWidth
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={handlePasswordChange("newPassword")}
              error={!!passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                      sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      {showNewPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "orange" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange("confirmPassword")}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                      sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "orange" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
                "& .MuiFormHelperText-root": { color: "#f44336" },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setPasswordDialogOpen(false)}
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePasswordSubmit}
            variant="contained"
            sx={{
              backgroundColor: "orange",
              color: "black",
              "&:hover": {
                backgroundColor: "#ff8c00",
              },
            }}
          >
            Update Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Email Dialog */}
      <Dialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "rgba(26, 26, 26, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            minWidth: "400px",
          },
        }}
      >
        <DialogTitle sx={{ color: "white" }}>Change Email</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="New Email Address"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "orange" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setEmailDialogOpen(false)}
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEmailSubmit}
            variant="contained"
            sx={{
              backgroundColor: "orange",
              color: "black",
              "&:hover": {
                backgroundColor: "#ff8c00",
              },
            }}
          >
            Update Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "rgba(26, 26, 26, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            minWidth: "400px",
          },
        }}
      >
        <DialogTitle sx={{ color: "white" }}>Delete Account</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "rgba(255, 255, 255, 0.7)", mt: 2 }}>
            Are you sure you want to delete your account? This action cannot be
            undone and all your data will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            sx={{
              backgroundColor: "#d32f2f",
              color: "white",
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountPage;
