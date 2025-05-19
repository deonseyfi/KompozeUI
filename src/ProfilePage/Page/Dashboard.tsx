import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import UserHeader from '../Components/UserHeader';
import CoinTabs, {Coin} from '../Components/CoinTabs';
import SearchAccounts from '../Components/SearchAccounts';
import TradingChart from '../Components/TradingChart';
import TweetTable, {TweetRecord} from '../Components/TweetTable';

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


const COINS: Coin[] = [
    { symbol: 'BTC', imageUrl: '/icons/btc.png' },
    { symbol: 'ETH', imageUrl: '/icons/eth.png' },
    { symbol: 'XRP', imageUrl: '/icons/xrp.png' },
    { symbol: 'SOL', imageUrl: '/icons/sol.png' },
    { symbol: 'DOGE', imageUrl: '/icons/doge.png' },
    { symbol: 'LINK', imageUrl: '/icons/link.png' },
    { symbol: 'TAD', imageUrl: '/icons/tad.png' },
  ];

const Dashboard: React.FC = () => {
    const [selectedCoin, setSelectedCoin] = useState<string>(COINS[0].symbol);
    const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <Container maxWidth="lg" sx={{ py: 2, backgroundColor: 'darkgrey' }}>
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
