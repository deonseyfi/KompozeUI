// src/GlobalComponents/PageWrapper.tsx
import React, { useEffect, useState } from "react";
import { Box, Fade } from "@mui/material";

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Small delay to prevent flash of unstyled content
    const timer = setTimeout(() => {
      setShow(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Fade in={show} timeout={300}>
      <Box sx={{ minHeight: "100vh" }}>{children}</Box>
    </Fade>
  );
};
