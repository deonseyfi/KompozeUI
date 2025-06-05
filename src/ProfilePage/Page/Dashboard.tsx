import React, { useState } from "react";
import UserHeader from "../Components/UserHeader";
import CoinTabs, { Coin } from "../Components/CoinTabs";
import SearchAccounts from "../Components/SearchAccounts";
import TradingChart from "../Components/TradingChart";
import TweetTable, { TweetRecord } from "../Components/TweetTable";
import { getCoinIcon } from "../Components/Icons";
import { useUserSentiment } from "../apidata/UserProfilePageData";
import { useCryptoPrice } from "../apidata/CrytpoData";
import { useParams } from "react-router-dom";
import {
  LineData,
  CandlestickData,
  SeriesMarker,
  BusinessDay,
  UTCTimestamp,
} from "lightweight-charts";
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";


const COINS: Coin[] = [
  { symbol: "BTC", imageUrl: getCoinIcon("btc") },
  { symbol: "ETH", imageUrl: getCoinIcon("eth") },
  { symbol: "XRP", imageUrl: getCoinIcon("xrp") },
  { symbol: "SOL", imageUrl: getCoinIcon("sol") },
  { symbol: "DOGE", imageUrl: getCoinIcon("doge") },
  { symbol: "LINK", imageUrl: getCoinIcon("link") },
];

const Dashboard: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState<string>(COINS[0].symbol);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { username } = useParams<{ username: string }>();
  const selectedUser = username ?? "apechartz";
  const { data, loading, error } = useUserSentiment(selectedUser);
  const { cryptodata, cryptoloading, cryptoerror } = useCryptoPrice(
    selectedCoin,
    "2024-01-01",
    new Date().toString(),
    "daily"
  ); // Assuming this is the correct hook for crypto data
  const coinList: Coin[] = [];
  const cryptoPrice: CandlestickData[] = [];
  const tweets: any[] = [];

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
      const date = item[1]["time"];
      const timeStamp = new Date(date).getTime();
      const open = parseFloat(item[1]["open"]);
      const high = parseFloat(item[1]["high"]);
      const low = parseFloat(item[1]["low"]);
      const close = parseFloat(item[1]["close"]);

      cryptoPrice.push({
        time: timeStamp as UTCTimestamp,
        open,
        high,
        low,
        close,
      });
    });
  }
  //Coin Array Creation
  if (data) {
    const coins = data.data ? Object.keys(data.data) : [];
    const coinObjects: Coin[] = coins.map((coin) => ({
      symbol: coin,
      imageUrl: getCoinIcon(coin.toLowerCase()),
    }));
    coinList.push(...coinObjects);
    if (data.data && typeof data.data === "object" && "BTC" in data.data) {
      (data.data as Record<string, any>)[selectedCoin]["tweets"].forEach(
        (tweet: any) => {
  const [selectedCoin, setSelectedCoin] = useState<string>(COINS[0].symbol);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data, loading, error } = useUserSentiment("apechartz");
  const { cryptodata, cryptoloading, cryptoerror } = useCryptoPrice(
    selectedCoin,
    "2024-01-01",
    new Date().toString(),
    "daily"
  );

  const coinList: Coin[] = [];
  const cryptoPrice: CandlestickData[] = [];
  const tweets: any[] = [];

  // Force page to be scrollable
  React.useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    document.body.style.height = "auto";
    document.documentElement.style.height = "auto";

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.height = "";
    };
  }, []);

  // Loading state with consistent styling
  if (loading || cryptoloading) {
    return (
      <Box
        sx={{
          backgroundColor: "#000",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "orange" }} size={60} />
        <Typography sx={{ color: "white", fontSize: "1.2rem" }}>
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  // Error state with consistent styling
  if (error || cryptoerror) {
    return (
      <Box
        sx={{
          backgroundColor: "#000",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          sx={{
            backgroundColor: "#111",
            border: "2px solid #ff4444",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{ color: "#ff4444", fontSize: "1.1rem", fontWeight: "bold" }}
          >
            Error Loading Data
          </Typography>
          <Typography sx={{ color: "white", mt: 1 }}>
            {error || cryptoerror}
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Process crypto pricing data
  if (cryptodata?.data) {
    const dataArray = Object.entries(cryptodata.data);
    dataArray.forEach((item) => {
      const date = item[1]["time"];
      const timeStamp = new Date(date).getTime();
      const open = parseFloat(item[1]["open"]);
      const high = parseFloat(item[1]["high"]);
      const low = parseFloat(item[1]["low"]);
      const close = parseFloat(item[1]["close"]);

      cryptoPrice.push({
        time: timeStamp as UTCTimestamp,
        open,
        high,
        low,
        close,
      });
    });
  }

  // Process coin array and tweets data
  if (data) {
    const coins = data.data ? Object.keys(data.data) : [];
    const coinObjects: Coin[] = coins.map((coin) => ({
      symbol: coin,
      imageUrl: getCoinIcon(coin.toLowerCase()),
    }));
    coinList.push(...coinObjects);

    if (
      data.data &&
      typeof data.data === "object" &&
      selectedCoin in data.data
    ) {
      (data.data as Record<string, any>)[selectedCoin]["tweets"].forEach(
        (tweet: any) => {
          tweets.push({
            tweet: tweet.text,
            sentimentRating: tweet.sentiment_score,
            accuracy: tweet.accuracy,
            time: tweet.created_at,
          });
        }
      );
    }
  }
  // Create better options for loading and errors
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
          });
        }
      );
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2, backgroundColor: "black" }}>
      <UserHeader
        username={`@${selectedUser}`}
        // NEEDS WORK TO GET REAL TIME
        avgTimeframe="Short Term"
        accuracy={84}
      />
    <Box
      sx={{
        backgroundColor: "#000",
        width: "100%",
        minHeight: "100vh",
        overflow: "visible !important",
        position: "relative",
        pt: 0, // No padding needed since components scroll normally
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          px: 2, // Match navbar padding
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "none !important", // Match navbar full width
        }}
      >
        {/* Header Section */}
        <UserHeader
          username="@username"
          avgTimeframe="Short Term"
          accuracy={84}
        />

        {/* Controls Section */}
        <Paper
          sx={{
            backgroundColor: "#111",
            border: "1px solid #333",
            borderRadius: 2,
            p: 2,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            flexDirection={{ xs: "column", md: "row" }}
            gap={2}
          >
            <Box sx={{ width: { xs: "100%", md: "auto" } }}>
              <Typography
                sx={{
                  color: "orange",
                  mb: 1,
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                }}
              >
                Select Cryptocurrency
              </Typography>
              <CoinTabs
                coins={coinList.length > 0 ? coinList : COINS}
                selected={selectedCoin}
                onChange={setSelectedCoin}
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "250px" } }}>
              <Typography
                sx={{
                  color: "orange",
                  mb: 1,
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                }}
              >
                Search Accounts
              </Typography>
              <SearchAccounts onSearch={setSearchTerm} />
            </Box>
          </Box>
        </Paper>

        {/* Trading Chart Section - Isolated */}
        <Paper
          sx={{
            backgroundColor: "#111",
            border: "1px solid #333",
            borderRadius: 2,
            p: 2,
            position: "relative",
            zIndex: 0,
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
            flexWrap="wrap"
            gap={1}
          >
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: { xs: "1.1rem", md: "1.3rem" },
              }}
            >
              {selectedCoin} Price Chart
            </Typography>
            <Box
              sx={{
                backgroundColor: "orange",
                color: "black",
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              LIVE
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "400px",
              backgroundColor: "#000",
              borderRadius: 1,
              border: "1px solid #444",
              position: "relative",
              isolation: "isolate",
              "& > *": {
                pointerEvents: "auto",
              },
            }}
          >
            {cryptoPrice.length > 0 ? (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <TradingChart candlestickdata={cryptoPrice} tweets={tweets} />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography sx={{ color: "#666" }}>
                  No chart data available for {selectedCoin}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

       

        {/* Tweet Analysis Section */}
        <Paper
          sx={{
            backgroundColor: "#111",
            border: "1px solid #333",
            borderRadius: 2,
            p: 2,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            flexWrap="wrap"
            gap={1}
          >
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: { xs: "1.1rem", md: "1.3rem" },
              }}
            >
              Sentiment Analysis
            </Typography>
            <Box
              sx={{
                backgroundColor: tweets.length > 0 ? "#2e7d32" : "#d32f2f",
                color: "white",
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              {tweets.length} tweets analyzed
            </Box>
          </Box>

          {tweets.length > 0 ? (
            <TweetTable records={tweets} />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: 200,
                backgroundColor: "#000",
                borderRadius: 1,
                border: "1px solid #444",
                gap: 2,
                textAlign: "center",
                p: 3,
              }}
            >
              <Typography sx={{ color: "#666", fontSize: "1.1rem" }}>
                No tweet data available for {selectedCoin}
              </Typography>
              <Typography sx={{ color: "#888", fontSize: "0.9rem" }}>
                Try selecting a different cryptocurrency
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Bottom spacer to ensure content is accessible */}
        <Box sx={{ height: "100px" }} />
      </Container>
    </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <CoinTabs
          coins={coinList}
          selected={selectedCoin}
          onChange={setSelectedCoin}
        />
        <SearchAccounts onSearch={setSearchTerm} />
      </Box>

      <TradingChart candlestickdata={cryptoPrice} tweets={tweets} />

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
  // Remove repeated entries in dupes (if a timestamp occurs > 2 times)
  return Array.from(new Set(dupes));
}

