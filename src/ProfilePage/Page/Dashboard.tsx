import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import UserHeader from '../Components/UserHeader';
import CoinTabs, {Coin} from '../Components/CoinTabs';
import SearchAccounts from '../Components/SearchAccounts';
import TradingChart from '../Components/TradingChart';
import TweetTable, {TweetRecord} from '../Components/TweetTable';
import { getCoinIcon } from '../Components/Icons';
import { useUserSentiment } from '../apidata/UserProfilePageData';
import { useCryptoPrice } from '../apidata/CrytpoData';
import { LineData, CandlestickData, SeriesMarker, BusinessDay } from 'lightweight-charts';


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
    const { data, loading, error } = useUserSentiment('apechartz'); 
    const { cryptodata, cryptoloading, cryptoerror } = useCryptoPrice('BTC','2024-05-01','2025-05-21','daily'); // Assuming this is the correct hook for crypto data
    const coinList: Coin[] = [];
    const cryptoPrice: CandlestickData[] = [];
    const tweets: any[] = []

    if (cryptoloading) {
      return <div>Loading crypto data...</div>;
    }
    if (cryptoerror) {
      return <div>Error fetching crypto data: {cryptoerror}</div>;
    }

    if (cryptodata?.data) {
      // Assuming cryptodata.data is an array of candlestick data
      const dataArray = Object.entries(cryptodata.data);
      // Create new array of CandlestickData objects
      dataArray.map((item) => {
        const date = item[1]['time'];
       
        const parts: string[] = date.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JavaScript
        const day = parseInt(parts[2].slice(0,2), 10);
       
        const time: BusinessDay = { year, month, day };
        const open = parseFloat(item[1]['open']);
        const high = parseFloat(item[1]['high']);
        const low = parseFloat(item[1]['low']);
        const close = parseFloat(item[1]['close']);

        cryptoPrice.push({ time, open, high, low, close });
      });
    }
    console.log('Crypto Price Data:', cryptoPrice);
    if (data) {
      // Make an array of the keys from the data object
      const coins = data.data ? Object.keys(data.data) : [];
      // Create new array of Coin objects
      // with imageUrl set using getCoinIcon
      const coinObjects: Coin[] = coins.map((coin) => ({
        symbol: coin,
        imageUrl: getCoinIcon(coin.toLowerCase())
      }));
      coinList.push(...coinObjects);
      if (data.data && typeof data.data === 'object' && 'BTC' in data.data) {
        (data.data as Record<string, any>)["BTC"]["tweets"].forEach((tweet: any) => {
          tweets.push({
            tweet
          });
        });
      }
    }
    if (loading) return <div>Loading...</div>;
 // Default to first coin or empty string
    if (error) return <div>Error: {error}</div>;
  return (
    <Container maxWidth="lg" sx={{ py: 2, backgroundColor: 'black' }}>
      <UserHeader
        username="@username"
        avgTimeframe="Short Term"
        accuracy={84}
      />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <CoinTabs
          coins={coinList}
          selected={selectedCoin}
          onChange={setSelectedCoin}
        />
        <SearchAccounts onSearch={setSearchTerm} />
      </Box>

      <TradingChart candlestickdata={cryptoPrice} tweets={tweets}
      />

      <TweetTable records={sampleTweets} />
    </Container>
  );
};

export default Dashboard;
