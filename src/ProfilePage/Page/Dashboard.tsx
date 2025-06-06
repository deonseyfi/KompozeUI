import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
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

// This is hardcoded for 6 coins
const COINS: Coin[] = [
  { symbol: "BTC", imageUrl: getCoinIcon("btc") },
  { symbol: "ETH", imageUrl: getCoinIcon("eth") },
  { symbol: "XRP", imageUrl: getCoinIcon("xrp") },
  { symbol: "SOL", imageUrl: getCoinIcon("sol") },
  { symbol: "DOGE", imageUrl: getCoinIcon("doge") },
  { symbol: "LINK", imageUrl: getCoinIcon("link") },
];

// Helper function to format timeframe (same as in StickyHeadTable)
const formatTimeFrame = (days: number): string => {
  if (days <= 1) return "Day Trader";
  if (days <= 7) return "Swing Trader";
  if (days <= 30) return "Position Trader";
  return "Macro Trader";
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Add the same accuracy color function from StickyHeadTable
const getAccuracyColor = (value: number) => {
  if (value >= 90) return "#3AFF00";
  if (value >= 80) return "#00FFFF";
  if (value >= 70) return "#E8FF00";
  if (value >= 60) return "#FFF700";
  if (value >= 50) return "#FFE000";
  if (value >= 40) return "#FFB600";
  if (value >= 30) return "#FF9700";
  if (value >= 20) return "#FF7400";
  if (value >= 10) return "#FF5D00";
  return "#FF0000";
};

// Fetch user profile data (same API as StickyHeadTable)
async function fetchUserProfileData(username: string): Promise<{
  timeframe: string;
  accuracy: number;
} | null> {
  try {
    const response = await fetch("http://localhost:8001/usersentiment", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const apiData = await response.json();

    // Look for the user in the API data
    if (apiData.data && apiData.data[username]) {
      const userData = apiData.data[username];
      return {
        timeframe: formatTimeFrame(userData.timeFrame),
        accuracy: Math.round(userData.sentimentScore * 100),
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile data:", error);
    return null;
  }
}

const Dashboard: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState<string>(COINS[0].symbol);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userProfile, setUserProfile] = useState<{
    timeframe: string;
    accuracy: number;
  } | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(true);

  // User routing functionality from UserHookFunctionality branch
  const { username } = useParams<{ username: string }>();
  const selectedUser = username ?? "apechartz";

  const { data, loading, error } = useUserSentiment(selectedUser);
  const { cryptodata, cryptoloading, cryptoerror } = useCryptoPrice(
    selectedCoin,
    "2024-01-01",
    new Date().toString(),
    "daily"
  );

  const coinList: Coin[] = [];
  const cryptoPrice: CandlestickData[] = [];
  const tweets: any[] = [];

  // Fetch user profile data on component mount or when selectedUser changes
  useEffect(() => {
    const loadUserProfile = async () => {
      setProfileLoading(true);
      const profile = await fetchUserProfileData(selectedUser);
      setUserProfile(profile);
      setProfileLoading(false);
    };

    loadUserProfile();
  }, [selectedUser]);

  // Use profile data or fallback values
  const userTimeframe = userProfile?.timeframe || "Short Term";
  const userAccuracy = userProfile?.accuracy || 84;

  // Force page to be scrollable (from main branch)
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

  // Enhanced loading state with consistent styling (from main branch)
  if (loading || cryptoloading || profileLoading) {
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

  // Enhanced error state with consistent styling (from main branch)
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

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        width: "100%",
        minHeight: "100vh",
        overflow: "visible !important",
        position: "relative",
        pt: 0,
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          px: 2,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "none !important",
        }}
      >
        {/* Header Section with dynamic user data from API and color-coded accuracy */}
        <Paper
          sx={{
            backgroundColor: "#111",
            border: "1px solid #333",
            borderRadius: 2,
            p: 3,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              {`@${selectedUser}`}
            </Typography>
            <Box display="flex" gap={3} alignItems="center" flexWrap="wrap">
              <Box textAlign="center">
                <Typography
                  sx={{
                    color: "orange",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    mb: 0.5,
                  }}
                >
                  Avg. Trading Timeframe
                </Typography>
                <Typography
                  sx={{
                    color: "white",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                  }}
                >
                  {userTimeframe}
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography
                  sx={{
                    color: "orange",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    mb: 0.5,
                  }}
                >
                  Accuracy
                </Typography>
                <Box
                  sx={{
                    backgroundColor: getAccuracyColor(userAccuracy),
                    color: "#fff",
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  {userAccuracy}%
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

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
            <Box
              sx={{ width: { xs: "100%", md: "auto" }, minWidth: 0, flex: 1 }}
            >
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
              <Box
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  overflowY: "hidden",
                  transform: "rotateX(180deg)",
                  "&::-webkit-scrollbar": {
                    height: "2px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#333",
                    borderRadius: "1px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "orange",
                    borderRadius: "1px",
                    "&:hover": {
                      backgroundColor: "#ff8c00",
                    },
                  },
                  "& > *": {
                    transform: "rotateX(180deg)",
                  },
                }}
              >
                <Box sx={{ display: "inline-block", minWidth: "max-content" }}>
                  <CoinTabs
                    coins={coinList.length > 0 ? coinList : COINS}
                    selected={selectedCoin}
                    onChange={setSelectedCoin}
                  />
                </Box>
              </Box>
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
