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
import AdbIcon from "@mui/icons-material/Adb";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import WebLogo from "./weblogo6.png"; // adjust path if needed

const pages = [
  { label: "Discover", path: "/" },
  { label: "Analytics", path: "/analytics" },
  { label: "About Us", path: "/about" },
  { label: "API Platform", path: "/api-platform" },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "black",
        borderBottom: "1px solid white",
        boxShadow: "none",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop logo */}
          <Box
            component={NavLink}
            to="/landing"
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              mr: 2,
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

          {/* Mobile menu icon */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
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
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                  <NavLink
                    to={page.path}
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      color: isActive ? "orange" : "black",
                      fontWeight: 600,
                    })}
                  >
                    {page.label}
                  </NavLink>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile logo */}
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>

          {/* Desktop navigation links */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 4 }}>
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

          {/* Right side buttons */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              ml: 2,
            }}
          >
            <Button
              variant="text"
              startIcon={<StarIcon />}
              sx={{
                color: "white",
                textTransform: "none",
                "&:hover": {
                  color: "orange",
                  backgroundColor: "transparent",
                },
              }}
            >
              Watchlist
            </Button>
            <Button
              variant="outlined"
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
