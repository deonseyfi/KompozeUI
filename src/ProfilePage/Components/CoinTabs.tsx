import React from 'react';
import { Tabs, Tab, Avatar } from '@mui/material';

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
  const selectedIndex = coins.findIndex(c => c.symbol === selected);

  return (
    <Tabs
      value={selectedIndex >= 0 ? selectedIndex : 0}
      onChange={(_, idx) => onChange(coins[idx].symbol)}
      textColor="primary"
      indicatorColor="primary"
      sx={{ minHeight: 36, backgroundColor : 'darkgrey' }}
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
          sx={{ minWidth: 80, textTransform: 'none' }}
        />
      ))}
    </Tabs>
  );
};

export default CoinTabs;
