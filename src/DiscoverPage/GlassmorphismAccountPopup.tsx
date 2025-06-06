import * as React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../ProfilePage/Components/BackendAuthContext";

interface GlassmorphismAccountPopupProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const GlassmorphismAccountPopup: React.FC<GlassmorphismAccountPopupProps> = ({
  anchorEl,
  open,
  onClose,
  onLogout,
}) => {
  const { user } = useAuth();

  // Get user initials
  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Get position relative to anchor element
  const getPopupPosition = () => {
    if (!anchorEl) return { top: 0, right: 0 };

    const rect = anchorEl.getBoundingClientRect();
    return {
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    };
  };

  const position = getPopupPosition();

  const menuItems = [
    {
      icon: <PersonIcon />,
      label: "Profile",
      onClick: () => console.log("Profile clicked"),
    },
    {
      icon: <SettingsIcon />,
      label: "Settings",
      onClick: () => console.log("Settings clicked"),
    },
    {
      icon: <DashboardIcon />,
      label: "Dashboard",
      onClick: () => console.log("Dashboard clicked"),
    },
    {
      icon: <NotificationsIcon />,
      label: "Notifications",
      onClick: () => console.log("Notifications clicked"),
    },
    { icon: <LogoutIcon />, label: "Logout", onClick: onLogout },
  ];

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <Box
        onClick={onClose}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1200,
          backgroundColor: "transparent",
        }}
      />

      {/* Dark Theme Popup */}
      <Box
        sx={{
          position: "fixed",
          top: `${position.top}px`,
          right: `${position.right}px`,
          width: "300px",
          background: "rgba(30, 30, 30, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.8)",
          zIndex: 1300,
          overflow: "hidden",
          animation: "darkPop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
          "@keyframes darkPop": {
            "0%": {
              opacity: 0,
              transform: "translateY(-10px) scale(0.95)",
            },
            "100%": {
              opacity: 1,
              transform: "translateY(0) scale(1)",
            },
          },
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            padding: "24px",
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(40, 40, 40, 0.8), rgba(20, 20, 20, 0.9))",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Profile Picture */}
          <Box
            sx={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, orange, #FF8C00)",
              margin: "0 auto 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "600",
              fontSize: "24px",
              boxShadow: "0 4px 16px rgba(255, 165, 0, 0.3)",
              border: "2px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {getUserInitials()}
          </Box>

          {/* User Info */}
          <Typography
            variant="h6"
            sx={{
              color: "#FFFFFF",
              fontWeight: 600,
              marginBottom: "4px",
              fontSize: "16px",
              letterSpacing: "0.02em",
            }}
          >
            {user?.name || "User"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "13px",
              fontWeight: 400,
            }}
          >
            {user?.email || "user@example.com"}
          </Typography>
        </Box>

        {/* Menu Items */}
        <Box sx={{ padding: "8px" }}>
          {menuItems.map((item, index) => (
            <Box
              key={index}
              onClick={item.onClick}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                color: "rgba(255, 255, 255, 0.9)",
                cursor: "pointer",
                borderRadius: "8px",
                marginBottom: "2px",
                transition: "all 0.2s ease",
                background: "transparent",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#FFFFFF",
                  "& .MuiSvgIcon-root": {
                    color: "orange",
                  },
                },
                "&:last-child": {
                  marginTop: "8px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "rgba(255, 107, 107, 0.9)",
                  "&:hover": {
                    background: "rgba(255, 140, 0, 0.12) !important",
                    color: "orange",
                  },
                },
              }}
            >
              <Box
                sx={{
                  marginRight: "12px",
                  display: "flex",
                  alignItems: "center",
                  "& .MuiSvgIcon-root": {
                    fontSize: "18px",
                    transition: "color 0.2s ease",
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              >
                {item.icon}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: "14px",
                  letterSpacing: "0.01em",
                }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default GlassmorphismAccountPopup;
