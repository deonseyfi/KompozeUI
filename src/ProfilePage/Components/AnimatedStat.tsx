import React from "react";
import { Box, Typography, Chip, alpha } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

interface AnimatedStatProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
}

const AnimatedStat: React.FC<AnimatedStatProps> = ({
  label,
  value,
  icon,
  trend,
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 1,
      p: 2,
      borderRadius: 2,
      background: alpha("#ff6b35", 0.05),
      border: `1px solid ${alpha("#ff6b35", 0.2)}`,
      transition: "all 0.3s ease",
      "&:hover": {
        background: alpha("#ff6b35", 0.1),
        transform: "scale(1.02)",
      },
    }}
  >
    <Box display="flex" alignItems="center" gap={1}>
      {icon}
      <Typography sx={{ color: "#888", fontSize: "0.85rem" }}>
        {label}
      </Typography>
    </Box>
    <Box display="flex" alignItems="baseline" gap={1}>
      <Typography
        sx={{
          color: "white",
          fontSize: "1.5rem",
          fontWeight: "bold",
          fontFamily: "monospace",
        }}
      >
        {value}
      </Typography>
      {trend && (
        <Chip
          size="small"
          icon={trend > 0 ? <TrendingUp /> : <TrendingDown />}
          label={`${trend > 0 ? "+" : ""}${trend}%`}
          sx={{
            backgroundColor:
              trend > 0 ? alpha("#4caf50", 0.2) : alpha("#f44336", 0.2),
            color: trend > 0 ? "#4caf50" : "#f44336",
            border: `1px solid ${trend > 0 ? "#4caf50" : "#f44336"}`,
            "& .MuiChip-icon": {
              color: "inherit",
              fontSize: "0.9rem",
            },
          }}
        />
      )}
    </Box>
  </Box>
);

export default AnimatedStat;
