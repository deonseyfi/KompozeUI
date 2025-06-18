import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import WebLogo from "./newlogo4.png"; // adjust path if needed
import { useAuth } from "./ProfilePage/Components/BackendAuthContext";
import LoginModal from "./ProfilePage/Components/LoginModal";

const pages = [
  { label: "Discover", path: "/" },
  { label: "Analytics", path: "/analytics" },
  { label: "About Us", path: "/about" },
  { label: "Ask Z31", path: "/ask-z31" },
];

function LandingAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
    // Prevent body scroll shift by maintaining scrollbar space
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "0px"; // No extra padding needed
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    // Restore body scroll
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  };

  const handleLoginClick = () => {
    setLoginModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setAnchorElUser(null);
  };

  const handleSettingsClick = () => {
    navigate("/settings");
    handleCloseUserMenu();
  };

  const handleAccountClick = () => {
    navigate("/account");
    handleCloseUserMenu();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      const names = user.name.split(" ");
      return names
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <>
      <AppBar
        position="absolute"
        sx={{
          backgroundColor: "transparent",
          borderBottom: "none",
          borderTop: "none",
          boxShadow: "none",
          marginTop: "0px",
          zIndex: 10,
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            px: 0,
            mx: 0,
            width: "100%",
            maxWidth: "none !important",
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              px: 2,
              display: "flex",
              alignItems: "center",
              width: "100%",
              minHeight: "64px",
            }}
          >
            {/* Desktop logo */}
            <Box
              component={NavLink}
              to="/landing"
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                textDecoration: "none",
                userSelect: "none",
                cursor: "pointer",
              }}
            >
              <Box
                component="img"
                src={WebLogo}
                alt="Logo"
                sx={{ height: 40, pointerEvents: "none" }}
              />
            </Box>

            {/* Desktop navigation links - right next to logo */}
            <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2 }}>
              {pages.map((page) => (
                <Button
                  key={page.label}
                  component={NavLink}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    mx: 1.5,
                    color: "white",
                    textTransform: "none",
                    fontWeight: 600,
                    "&.active": {
                      color: "orange",
                      borderBottom: "2px solid orange",
                      borderRadius: 0,
                    },
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "orange",
                    },
                  }}
                >
                  {page.label}
                </Button>
              ))}
            </Box>

            {/* Spacer to push right buttons to the end */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} />

            {/* Desktop right side buttons */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
              }}
            >
              {isAuthenticated ? (
                <>
                  <Typography variant="body2" sx={{ color: "white", mx: 2 }}>
                    Welcome, {user?.name || user?.email}
                  </Typography>
                  <IconButton onClick={handleOpenUserMenu} sx={{ ml: 1 }}>
                    <PersonIcon sx={{ color: "orange", fontSize: 28 }} />
                  </IconButton>
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleLoginClick}
                    sx={{
                      color: "white",
                      borderColor: "orange",
                      textTransform: "none",
                      ml: 2,
                      "&:hover": {
                        color: "black",
                        backgroundColor: "orange",
                        borderColor: "orange",
                      },
                    }}
                  >
                    Login
                  </Button>
                  <IconButton sx={{ ml: 2 }}>
                    <PersonIcon sx={{ color: "orange", fontSize: 28 }} />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Mobile hamburger + logo + login */}
            <>
              {/* Mobile hamburger menu */}
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="open navigation menu"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorElNav}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  keepMounted
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiPaper-root": {
                      backgroundColor: "#1a1a1a",
                      color: "white",
                      minWidth: "150px",
                    },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                      <NavLink
                        to={page.path}
                        style={({ isActive }) => ({
                          textDecoration: "none",
                          color: isActive ? "orange" : "white",
                          fontWeight: 600,
                          width: "100%",
                        })}
                      >
                        {page.label}
                      </NavLink>
                    </MenuItem>
                  ))}
                  {isAuthenticated && (
                    <MenuItem onClick={handleLogout}>
                      <Box
                        sx={{ color: "white", fontWeight: 600, width: "100%" }}
                      >
                        🚪 Logout
                      </Box>
                    </MenuItem>
                  )}
                </Menu>
              </Box>

              {/* Mobile logo - center */}
              <Box
                component={NavLink}
                to="/landing"
                sx={{
                  display: { xs: "flex", md: "none" },
                  alignItems: "center",
                  textDecoration: "none",
                  userSelect: "none",
                  cursor: "pointer",
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <Box
                  component="img"
                  src={WebLogo}
                  alt="Logo"
                  sx={{ height: 32, pointerEvents: "none" }}
                />
              </Box>

              {/* Mobile spacer */}
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }} />

              {/* Mobile right side */}
              {!isAuthenticated && (
                <Button
                  variant="outlined"
                  onClick={handleLoginClick}
                  size="small"
                  sx={{
                    display: { xs: "flex", md: "none" },
                    color: "white",
                    borderColor: "orange",
                    textTransform: "none",
                    fontSize: "0.75rem",
                    "&:hover": {
                      color: "black",
                      backgroundColor: "orange",
                      borderColor: "orange",
                    },
                  }}
                >
                  Login
                </Button>
              )}

              {isAuthenticated && (
                <Box
                  sx={{
                    display: { xs: "flex", md: "none" },
                    alignItems: "center",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "white", mr: 1 }}>
                    {user?.name?.split(" ")[0] || user?.email?.split("@")[0]}
                  </Typography>
                  <IconButton onClick={handleOpenUserMenu} size="small">
                    <PersonIcon sx={{ color: "orange", fontSize: 20 }} />
                  </IconButton>
                </Box>
              )}
            </>
          </Toolbar>
        </Container>
      </AppBar>

      {/* User Menu Dropdown - Only for authenticated users */}
      {isAuthenticated && (
        <Menu
          anchorEl={anchorElUser}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "rgba(26, 26, 26, 0.95)",
              backdropFilter: "blur(10px)",
              color: "white",
              minWidth: "280px",
              mt: 1.5,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          {/* User Info Section with Avatar */}
          <Box
            sx={{
              px: 2.5,
              py: 2.5,
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                margin: "0 auto",
                backgroundColor: "orange",
                fontSize: "2rem",
                fontWeight: 600,
                boxShadow: "0 0 20px rgba(255, 165, 0, 0.5)",
              }}
            >
              {getUserInitials()}
            </Avatar>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "white", mt: 2 }}
            >
              {user?.name || "User"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              {user?.email || ""}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 1 }} />

          <MenuItem
            onClick={handleAccountClick}
            sx={{
              py: 1.5,
              px: 2.5,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
              transition: "background-color 0.2s ease",
            }}
          >
            <AccountCircleIcon
              sx={{ mr: 2, color: "rgba(255, 255, 255, 0.8)" }}
            />
            <Typography>Account</Typography>
          </MenuItem>

          <MenuItem
            onClick={handleSettingsClick}
            sx={{
              py: 1.5,
              px: 2.5,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
              transition: "background-color 0.2s ease",
            }}
          >
            <SettingsIcon sx={{ mr: 2, color: "rgba(255, 255, 255, 0.8)" }} />
            <Typography>Settings</Typography>
          </MenuItem>

          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 1 }} />

          <MenuItem
            onClick={handleLogout}
            sx={{
              py: 1.5,
              px: 2.5,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
              transition: "background-color 0.2s ease",
            }}
          >
            <LogoutIcon sx={{ mr: 2, color: "#ff6b6b" }} />
            <Typography sx={{ color: "#ff6b6b" }}>Logout</Typography>
          </MenuItem>
        </Menu>
      )}

      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
}

export default LandingAppBar;
