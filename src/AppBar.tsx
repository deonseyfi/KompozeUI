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
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import WebLogo from "./newlogo4.png";
import { useAuth } from "./ProfilePage/Components/BackendAuthContext";
import LoginModal from "./ProfilePage/Components/LoginModal";
import { useWatchlist } from "./DiscoverPage/Components/WatchlistFunctionality";
import CryptoTickerBar from "./ProfilePage/Components/CryptoTicker";
import GlassmorphismAccountPopup from "./DiscoverPage/GlassmorphismAccountPopup";

const pages = [
  { label: "Discover", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Ask Z31", path: "/ask-z31" },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const [glassPopupOpen, setGlassPopupOpen] = React.useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { toggleUserWatchlistView, isUserWatchlistView } = useWatchlist();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Prevent MUI from causing layout shifts
  React.useEffect(() => {
    document.body.classList.add("mui-fixed");
    return () => {
      document.body.classList.remove("mui-fixed");
    };
  }, []);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    setGlassPopupOpen(false);
  };

  const handleLoginClick = () => {
    setLoginModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setGlassPopupOpen(false);
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

  // Format email for mobile screens
  const getFormattedEmail = () => {
    if (!user?.email) return "";
    if (!isMobileScreen) return user.email;

    // On mobile, truncate long emails
    const [username, domain] = user.email.split("@");
    if (username.length > 10) {
      return `${username.slice(0, 10)}...@${domain}`;
    }
    return user.email;
  };

  return (
    <>
      {/* CryptoTicker at the very top */}
      <CryptoTickerBar />

      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "black",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "none",
          top: 0,
          zIndex: 1200,
        }}
      >
        <Container
          maxWidth={false}
          sx={{ px: 0, mx: 0, width: "100%", maxWidth: "none !important" }}
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

            {/* Desktop nav links */}
            <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2 }}>
              {pages.map((page) => (
                <Button
                  key={page.label}
                  component={NavLink}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 1,
                    mx: 0.3,
                    color: "white",
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.875rem",
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

            {/* Spacer */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} />

            {/* Desktop right buttons */}
            <Box
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            >
              <Button
                variant="text"
                startIcon={<StarIcon />}
                onClick={toggleUserWatchlistView}
                sx={{
                  color: isUserWatchlistView ? "orange" : "white",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    color: "orange",
                    backgroundColor: "transparent",
                  },
                }}
              >
                {isUserWatchlistView ? "All Users" : "Watchlist"}
              </Button>

              {isAuthenticated ? (
                <>
                  <Typography variant="body2" sx={{ color: "white", mx: 2 }}>
                    {user?.name || user?.email}
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
                  <IconButton
                    sx={{
                      ml: 2,
                      cursor: "default",
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    <PersonIcon
                      sx={{ color: "rgba(255, 165, 0, 0.5)", fontSize: 28 }}
                    />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Mobile hamburger + logo */}
            <>
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
                  disableScrollLock={true} // Prevents scrollbar removal
                  disablePortal={false} // Keep portal for proper layering
                  transitionDuration={0} // Remove transition to prevent jump
                  MenuListProps={{
                    disablePadding: true,
                    sx: { py: 0.5 },
                  }}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0 8px 32px rgba(0, 0, 0, 0.5))",
                        mt: 1.5,
                        backgroundColor: "rgba(26, 26, 26, 0.95)",
                        backdropFilter: "blur(10px)",
                        color: "white",
                        minWidth: "200px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        // Prevent any transform origin issues
                        transformOrigin: "top left",
                        // Force GPU acceleration
                        transform: "translateZ(0)",
                      },
                    },
                  }}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {/* User Account Section at the TOP - Only show when authenticated */}
                  {isAuthenticated && (
                    <>
                      {/* User Info */}
                      <Box
                        sx={{
                          px: 2.5,
                          py: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: "orange",
                            fontSize: "1rem",
                            fontWeight: 600,
                          }}
                        >
                          {getUserInitials()}
                        </Avatar>
                        <Box>
                          <Typography
                            sx={{
                              color: "white",
                              fontSize: "0.9rem",
                              fontWeight: 500,
                            }}
                          >
                            {user?.name || "User"}
                          </Typography>
                          <Typography
                            sx={{
                              color: "rgba(255, 255, 255, 0.6)",
                              fontSize: "0.75rem",
                            }}
                          >
                            {getFormattedEmail()}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider
                        sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 1 }}
                      />
                    </>
                  )}

                  {/* Watchlist Toggle */}
                  <MenuItem
                    onClick={toggleUserWatchlistView}
                    sx={{
                      py: 1.5,
                      px: 2.5,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                      },
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <Box
                      sx={{
                        color: isUserWatchlistView ? "orange" : "white",
                        fontWeight: 500,
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <StarIcon
                        sx={{
                          fontSize: 20,
                          color: isUserWatchlistView
                            ? "orange"
                            : "rgba(255, 255, 255, 0.8)",
                        }}
                      />
                      {isUserWatchlistView ? "All Users" : "Watchlist"}
                    </Box>
                  </MenuItem>

                  <Divider
                    sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 1 }}
                  />

                  {/* Navigation Links */}
                  {pages.map((page) => (
                    <MenuItem
                      key={page.label}
                      onClick={handleCloseNavMenu}
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                        },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <NavLink
                        to={page.path}
                        style={({ isActive }) => ({
                          textDecoration: "none",
                          color: isActive ? "orange" : "white",
                          fontWeight: 500,
                          width: "100%",
                          display: "block",
                        })}
                      >
                        {page.label}
                      </NavLink>
                    </MenuItem>
                  ))}

                  {/* Account Settings Section - Only show when authenticated */}
                  {isAuthenticated && (
                    <>
                      <Divider
                        sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 1 }}
                      />

                      <MenuItem
                        onClick={() => {
                          handleAccountClick();
                          handleCloseNavMenu();
                        }}
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
                          sx={{
                            mr: 1.5,
                            color: "rgba(255, 255, 255, 0.8)",
                            fontSize: 20,
                          }}
                        />
                        <Typography sx={{ fontSize: "0.9rem" }}>
                          Account
                        </Typography>
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          handleSettingsClick();
                          handleCloseNavMenu();
                        }}
                        sx={{
                          py: 1.5,
                          px: 2.5,
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                          },
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        <SettingsIcon
                          sx={{
                            mr: 1.5,
                            color: "rgba(255, 255, 255, 0.8)",
                            fontSize: 20,
                          }}
                        />
                        <Typography sx={{ fontSize: "0.9rem" }}>
                          Settings
                        </Typography>
                      </MenuItem>

                      <Divider
                        sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 1 }}
                      />

                      <MenuItem
                        onClick={() => {
                          handleLogout();
                          handleCloseNavMenu();
                        }}
                        sx={{
                          py: 1.5,
                          px: 2.5,
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                          },
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        <LogoutIcon
                          sx={{ mr: 1.5, color: "#ff6b6b", fontSize: 20 }}
                        />
                        <Typography
                          sx={{ color: "#ff6b6b", fontSize: "0.9rem" }}
                        >
                          Logout
                        </Typography>
                      </MenuItem>
                    </>
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

              {/* Mobile right side */}
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }} />

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
          disableScrollLock={true} // Prevents scrollbar removal
          disablePortal={false} // Keep portal for proper layering
          transitionDuration={0} // Remove transition to prevent jump
          MenuListProps={{
            disablePadding: true,
            sx: { py: 0.5 },
          }}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0 8px 32px rgba(0, 0, 0, 0.5))",
                mt: 1.5,
                backgroundColor: "rgba(26, 26, 26, 0.95)",
                backdropFilter: "blur(10px)",
                color: "white",
                minWidth: { xs: "240px", sm: "280px" }, // Responsive width
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                // Prevent any transform origin issues
                transformOrigin: "top right",
                // Force GPU acceleration
                transform: "translateZ(0)",
              },
            },
          }}
        >
          {/* User Info Section with Avatar */}
          <Box
            sx={{
              px: { xs: 2, sm: 2.5 }, // Responsive padding
              py: { xs: 2, sm: 2.5 },
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                width: { xs: 60, sm: 80 }, // Responsive avatar size
                height: { xs: 60, sm: 80 },
                margin: "0 auto",
                backgroundColor: "orange",
                fontSize: { xs: "1.5rem", sm: "2rem" }, // Responsive font size
                fontWeight: 600,
                boxShadow: "0 0 20px rgba(255, 165, 0, 0.5)",
              }}
            >
              {getUserInitials()}
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "white",
                mt: { xs: 1.5, sm: 2 },
                fontSize: { xs: "1.1rem", sm: "1.25rem" }, // Responsive font size
              }}
            >
              {user?.name || "User"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: { xs: "0.85rem", sm: "0.875rem" }, // Responsive font size
                px: 1, // Add some padding to prevent edge overflow
                wordBreak: "break-word", // Break long emails nicely
              }}
            >
              {getFormattedEmail()}
            </Typography>
          </Box>

          <Divider
            sx={{
              borderColor: "rgba(255, 255, 255, 0.1)",
              my: { xs: 0.5, sm: 1 },
            }}
          />

          <MenuItem
            onClick={handleAccountClick}
            sx={{
              py: { xs: 1, sm: 1.5 }, // Responsive padding
              px: { xs: 2, sm: 2.5 },
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
              transition: "background-color 0.2s ease",
            }}
          >
            <AccountCircleIcon
              sx={{
                mr: { xs: 1.5, sm: 2 },
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: { xs: 20, sm: 24 }, // Responsive icon size
              }}
            />
            <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
              Account
            </Typography>
          </MenuItem>

          <MenuItem
            onClick={handleSettingsClick}
            sx={{
              py: { xs: 1, sm: 1.5 }, // Responsive padding
              px: { xs: 2, sm: 2.5 },
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
              transition: "background-color 0.2s ease",
            }}
          >
            <SettingsIcon
              sx={{
                mr: { xs: 1.5, sm: 2 },
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: { xs: 20, sm: 24 }, // Responsive icon size
              }}
            />
            <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
              Settings
            </Typography>
          </MenuItem>

          <Divider
            sx={{
              borderColor: "rgba(255, 255, 255, 0.1)",
              my: { xs: 0.5, sm: 1 },
            }}
          />

          <MenuItem
            onClick={handleLogout}
            sx={{
              py: { xs: 1, sm: 1.5 }, // Responsive padding
              px: { xs: 2, sm: 2.5 },
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
              transition: "background-color 0.2s ease",
            }}
          >
            <LogoutIcon
              sx={{
                mr: { xs: 1.5, sm: 2 },
                color: "#ff6b6b",
                fontSize: { xs: 20, sm: 24 }, // Responsive icon size
              }}
            />
            <Typography
              sx={{ color: "#ff6b6b", fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              Logout
            </Typography>
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

export default ResponsiveAppBar;
