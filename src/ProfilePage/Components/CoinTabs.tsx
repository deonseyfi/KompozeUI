import React from "react";
import { Tabs, Tab, Avatar } from "@mui/material";

export interface Coin {
  symbol: string;
  imageUrl: string;
}

interface CoinTabsProps {
  coins: Coin[];
  selected: string;
  onChange: (symbol: string) => void;
}

const CoinTabs: React.FC<CoinTabsProps> = ({ coins, selected, onChange }) => {
  // find index of currently selected coin
  const selectedIndex = coins.findIndex((c) => c.symbol === selected);

  return (
    <Tabs
      value={selectedIndex >= 0 ? selectedIndex : 0}
      onChange={(_, idx) => onChange(coins[idx].symbol)}
      textColor="primary"
      sx={{
        minHeight: 36,
        backgroundColor: "black",
        "& .MuiTabs-indicator": {
          display: "none", // Remove the indicator color
        },
      }}
    >
      {coins.map((c) => (
        <Tab
          key={c.symbol}
          icon={
            <Avatar
              src={c.imageUrl}
              alt={c.symbol}
              sx={{ width: 24, height: 24 }}
            />
          }
          iconPosition="start"
          label={c.symbol.toUpperCase()}
          sx={{
            minWidth: 80,
            textTransform: "none",
            color: "white",
            fontWeight: "bold",
            "&.active": { borderBottom: "#ff6b35" },
            "&.Mui-selected": {
              color: "#ff6b35",
              borderBottom: "2px solid #ff6b35", // Add bottom border for selected tab
            },
            "&:hover": { color: "#ff6b35" },
            "&.MuiTabs-indicator": { backgroundColor: "#ff6b35" },
          }} // Add hover effect
        />
      ))}
    </Tabs>
  );
};

export default CoinTabs;
