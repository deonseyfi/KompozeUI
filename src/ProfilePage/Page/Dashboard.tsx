import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import UserHeader from '../Components/UserHeader';
import CoinTabs, {Coin} from '../Components/CoinTabs';
import SearchAccounts from '../Components/SearchAccounts';
import TradingChart from '../Components/TradingChart';
import TweetTable, {TweetRecord} from '../Components/TweetTable';
import { getCoinIcon } from '../Components/Icons';
import { get } from 'http';

const sampleTweets: TweetRecord[] = [
    {
      tweet: "Just bought more BTC!",
      sentimentRating: 0.85,
      accuracy: 92,
      time: "2025‑05‑16 14:20"
    },
    {
      tweet: "ETH to the moon 🚀",
      sentimentRating: 0.78,
      accuracy: 88,
      time: "2025‑05‑16 13:55"
    },
    // …more rows
  ];

// Create data with imageURL pointing to cryptocurrency-icons package 



const COINS: Coin[] = [
    { symbol: 'BTC', imageUrl: getCoinIcon('btc') },
    { symbol: 'ETH', imageUrl: getCoinIcon('eth') },
    { symbol: 'XRP', imageUrl: getCoinIcon('xrp') },
    { symbol: 'SOL', imageUrl: getCoinIcon('sol') },
    { symbol: 'DOGE', imageUrl: getCoinIcon('doge') },
    { symbol: 'LINK', imageUrl: getCoinIcon('link') },
  ];

const Dashboard: React.FC = () => {
    const [selectedCoin, setSelectedCoin] = useState<string>(COINS[0].symbol);
    const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <Container maxWidth="lg" sx={{ py: 2, backgroundColor: 'black' }}>
      <UserHeader
        username="@username"
        avgTimeframe="Short Term"
        accuracy={84}
      />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <CoinTabs
          coins={COINS}
          selected={selectedCoin}
          onChange={setSelectedCoin}
        />
        <SearchAccounts onSearch={setSearchTerm} />
      </Box>

      <TradingChart />

      <TweetTable records={sampleTweets} />
    </Container>
  );
};

export default Dashboard;
