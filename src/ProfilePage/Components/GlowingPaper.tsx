import React from "react";
import { Paper, alpha } from "@mui/material";

interface GlowingPaperProps {
  children: React.ReactNode;
  sx?: any;
  [key: string]: any;
}

const GlowingPaper: React.FC<GlowingPaperProps> = ({
  children,
  sx = {},
  ...props
}) => (
  <Paper
    sx={{
      background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)",
      border: "1px solid",
      borderColor: alpha("#ff6b35", 0.3),
      borderRadius: 3,
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s ease",
      "&:hover": {
        borderColor: alpha("#ff6b35", 0.5),
        transform: "translateY(-2px)",
        boxShadow: `0 8px 32px ${alpha("#ff6b35", 0.2)}`,
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent, #ff6b35, transparent)",
        opacity: 0.5,
      },
      ...sx,
    }}
    {...props}
  >
    {children}
  </Paper>
);

export default GlowingPaper;
