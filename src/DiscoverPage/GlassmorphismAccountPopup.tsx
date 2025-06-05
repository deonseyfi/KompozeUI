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
    { icon: <PersonIcon />, label: "Profile", onClick: () => console.log("Profile clicked") },
    { icon: <SettingsIcon />, label: "Settings", onClick: () => console.log("Settings clicked") },
    { icon: <DashboardIcon />, label: "Dashboard", onClick: () => console.log("Dashboard clicked") },
    { icon: <NotificationsIcon />, label: "Notifications", onClick: () => console.log("Notifications clicked") },
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
      
      {/* Glassmorphism Popup */}
      <Box
        sx={{
          position: "fixed",
          top: `${position.top}px`,
          right: `${position.right}px`,
          width: "300px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)", // Safari support
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          zIndex: 1300,
          overflow: "hidden",
          animation: "glassPop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
          "@keyframes glassPop": {
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
            padding: "25px",
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))",
          }}
        >
          {/* Profile Picture */}
          <Box
            sx={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "linear-gradient(45deg, #ff6b6b, #ee5a24)",
              margin: "0 auto 15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "28px",
              boxShadow: "0 5px 15px rgba(255, 107, 107, 0.3)",
              border: "3px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            {getUserInitials()}
          </Box>
          
          {/* User Info */}
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: 600,
              marginBottom: "5px",
              fontSize: "18px",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            {user?.name || "User"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "14px",
            }}
          >
            {user?.email || "user@example.com"}
          </Typography>
        </Box>

        {/* Menu Items */}
        <Box sx={{ padding: "10px" }}>
          {menuItems.map((item, index) => (
            <Box
              key={index}
              onClick={item.onClick}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "15px 20px",
                color: "white",
                cursor: "pointer",
                borderRadius: "12px",
                marginBottom: "5px",
                transition: "all 0.3s ease",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.15)",
                  transform: "translateX(5px)",
                  boxShadow: "0 4px 12px rgba(255, 255, 255, 0.1)",
                },
                "&:last-child": {
                  marginTop: "10px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "rgba(255, 107, 107, 0.1)",
                  "&:hover": {
                    background: "rgba(255, 107, 107, 0.2)",
                  },
                },
              }}
            >
              <Box
                sx={{
                  marginRight: "12px",
                  opacity: 0.8,
                  "& .MuiSvgIcon-root": {
                    fontSize: "20px",
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