// src/MainLayout.tsx (or wherever your MainLayout is located)
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Fade } from "@mui/material";
import ResponsiveAppBar from "../AppBar";
import Footer from "../Footer/Footer";
import { GlobalStyles } from "../GlobalComponents/GlobalStyles";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <GlobalStyles />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#000",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ResponsiveAppBar />
        <Box
          component="main"
          sx={{
            flex: 1,
            position: "relative",
          }}
        >
          <Fade in={!isTransitioning} timeout={200}>
            <Box>{children}</Box>
          </Fade>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default MainLayout;
