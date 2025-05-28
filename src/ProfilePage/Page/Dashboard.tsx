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
import { LineData, CandlestickData, SeriesMarker, BusinessDay, UTCTimestamp } from 'lightweight-charts';


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
    const { cryptodata, cryptoloading, cryptoerror } = useCryptoPrice('BTC','2024-01-01',new Date().toString(),'daily'); // Assuming this is the correct hook for crypto data
    const coinList: Coin[] = [];
    const cryptoPrice: CandlestickData[] = [];
    const tweets: any[] = []

    // Remove soon and clean up
    if (cryptoloading) {
      return <div>Loading crypto data...</div>;
    }
    if (cryptoerror) {
      return <div>Error fetching crypto data: {cryptoerror}</div>;
    }

    // Crytpo Pricing Data
    if (cryptodata?.data) {
      // Assuming cryptodata.data is an array of candlestick data
      const dataArray = Object.entries(cryptodata.data);
      // Create new array of CandlestickData objects
      dataArray.map((item) => {
        const date = item[1]['time'];
        const timeStamp = new Date(date).getTime();
        const open = parseFloat(item[1]['open']);
        const high = parseFloat(item[1]['high']);
        const low = parseFloat(item[1]['low']);
        const close = parseFloat(item[1]['close']);
        
        cryptoPrice.push({ time: timeStamp as UTCTimestamp, open, high, low, close });
      });
    }
    //Coin Array Creation
    if (data) {
      const coins = data.data ? Object.keys(data.data) : [];
      const coinObjects: Coin[] = coins.map((coin) => ({
        symbol: coin,
        imageUrl: getCoinIcon(coin.toLowerCase())
      }));
      coinList.push(...coinObjects);
      if (data.data && typeof data.data === 'object' && 'BTC' in data.data) {
        (data.data as Record<string, any>)["BTC"]["tweets"].forEach((tweet: any) => {
          tweets.push({
            tweet: tweet.text,
            sentimentRating: tweet.sentiment_score,
            accuracy: tweet.accuracy,
            time: tweet.created_at,
          });
        });
      }
    }
    // Create better options for loading and errors
    if (loading) return <div>Loading...</div>;
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

      <TweetTable records={tweets} />
    </Container>
  );
};

export default Dashboard;


/** Returns true if every `time` value is unique */
export function areTimesUnique(data: CandlestickData[]): boolean {
  const seen = new Set<Object>();
  for (const { time } of data) {
    if (seen.has(time)) return false; // duplicate found
    seen.add(time);
  }
  return true;
}

/** Returns an array of duplicate timestamps (empty if none) */
export function findDuplicateTimes(data: CandlestickData[]): Object[] {
  const seen = new Set<Object>();
  const dupes: Object[] = [];
  for (const { time } of data) {
    if (seen.has(time)) dupes.push(time);
    else seen.add(time);
  }
  // Remove repeated entries in dupes (if a timestamp occurs > 2 times)
  return Array.from(new Set(dupes));
}