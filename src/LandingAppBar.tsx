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
import WebLogo from "./newlogo4.png"; // adjust path if needed

const pages = [
  { label: "Discover", path: "/" },
  { label: "Analytics", path: "/analytics" },
  { label: "About Us", path: "/about" },
  { label: "API Platform", path: "/api-platform" },
];

function LandingAppBar() {
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
          width: '100%',
          maxWidth: 'none !important' 
        }}
      >
        <Toolbar 
          disableGutters 
          sx={{ 
            px: 2,
            display: 'flex',
            alignItems: 'center',
            width: '100%' 
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
          <Box sx={{ flexGrow: 1 }} />

          {/* Right side buttons */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
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
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default LandingAppBar;