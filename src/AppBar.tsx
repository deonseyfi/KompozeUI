import * as React from "react";
import { NavLink } from "react-router-dom";
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
import WebLogo from "./newlogo4.png";
import { useAuth } from "./ProfilePage/Components/BackendAuthContext";
import LoginModal from "./ProfilePage/Components/LoginModal";
import { useWatchlist } from "./DiscoverPage/WatchlistFunctionality";
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

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
    setGlassPopupOpen(true);
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
                    my: 2,
                    mx: 1.5,
                    color: "white",
                    textTransform: "none",
                    fontWeight: 600,
                    "&.active": {
                      color: "#ff6b35",
                      borderBottom: "2px solid #ff6b35",
                      borderRadius: 0,
                    },
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "#ff6b35",
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
                  color: isUserWatchlistView ? "#ff6b35" : "white",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    color: "#ff6b35",
                    backgroundColor: "transparent",
                  },
                }}
              >
                {isUserWatchlistView ? "All Users" : "Watchlist"}
              </Button>

              {isAuthenticated ? (
                <>
                  <Typography variant="body2" sx={{ color: "white", mx: 2 }}>
                    Welcome, {user?.name || user?.email}
                  </Typography>
                  <IconButton onClick={handleOpenUserMenu} sx={{ ml: 1 }}>
                    <PersonIcon sx={{ color: "#ff6b35", fontSize: 28 }} />
                  </IconButton>
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleLoginClick}
                    sx={{
                      color: "white",
                      borderColor: "#ff6b35",
                      textTransform: "none",
                      ml: 2,
                      "&:hover": {
                        color: "black",
                        backgroundColor: "#ff6b35",
                        borderColor: "#ff6b35",
                      },
                    }}
                  >
                    Login
                  </Button>
                  <IconButton sx={{ ml: 2 }}>
                    <PersonIcon sx={{ color: "#ff6b35", fontSize: 28 }} />
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
                          color: isActive ? "#ff6b35" : "white",
                          fontWeight: 600,
                          width: "100%",
                        })}
                      >
                        {page.label}
                      </NavLink>
                    </MenuItem>
                  ))}
                  <MenuItem onClick={toggleUserWatchlistView}>
                    <Box
                      sx={{ color: "white", fontWeight: 600, width: "100%" }}
                    >
                      {isUserWatchlistView ? "All Users" : "⭐ Watchlist"}
                    </Box>
                  </MenuItem>
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
                    borderColor: "#ff6b35",
                    textTransform: "none",
                    fontSize: "0.75rem",
                    "&:hover": {
                      color: "black",
                      backgroundColor: "#ff6b35",
                      borderColor: "#ff6b35",
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
                    <PersonIcon sx={{ color: "#ff6b35", fontSize: 20 }} />
                  </IconButton>
                </Box>
              )}
            </>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Glassmorphism Account Popup - Only show when authenticated */}
      {isAuthenticated && (
        <GlassmorphismAccountPopup
          anchorEl={anchorElUser}
          open={glassPopupOpen}
          onClose={handleCloseUserMenu}
          onLogout={handleLogout}
        />
      )}

      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
}

export default ResponsiveAppBar;
