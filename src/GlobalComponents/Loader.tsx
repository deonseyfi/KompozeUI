// src/GlobalComponents/ConsistentLoader.tsx
import React from "react";
import { Box, CircularProgress, Typography, Fade } from "@mui/material";

interface ConsistentLoaderProps {
  loading: boolean;
  message?: string;
}

export const ConsistentLoader: React.FC<ConsistentLoaderProps> = ({
  loading,
  message = "Loading...",
}) => {
  return (
    <Fade in={loading} timeout={300}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at center, #1a1a1a 0%, #000 100%)",
          display: loading ? "flex" : "none",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          zIndex: 9999,
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            size={80}
            thickness={2}
            sx={{
              color: "#ff6b35",
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
        </Box>
        <Typography
          sx={{
            color: "#ff6b35",
            fontSize: "1.4rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {message}
        </Typography>
      </Box>
    </Fade>
  );
};
