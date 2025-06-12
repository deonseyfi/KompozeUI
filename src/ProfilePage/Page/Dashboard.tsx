import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Chip,
  Fade,
  Grow,
  useTheme,
  alpha,
} from "@mui/material";
import {
  ShowChart,
  Timeline,
  Assessment,
  Visibility,
} from "@mui/icons-material";
import UserHeader from "../Components/UserHeader";
import CoinTabs, { Coin } from "../Components/CoinTabs";
import SearchAccounts from "../Components/SearchAccounts";
import TradingChart from "../Components/TradingChart";
import TweetTable, { TweetRecord } from "../Components/TweetTable";
import { getCoinIcon } from "../Components/Icons";
import GlowingPaper from "../Components/GlowingPaper";
import AnimatedStat from "../Components/AnimatedStat";
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

const Dashboard: React.FC = () => {
  const theme = useTheme();
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

  // Enhanced scroll behavior
  React.useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    document.body.style.height = "auto";
    document.documentElement.style.height = "auto";
    document.body.style.backgroundColor = "#000";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.height = "";
      document.body.style.backgroundColor = "";
    };
  }, []);

  // Enhanced loading state
  if (loading || cryptoloading) {
    return (
      <Box
        sx={{
          background:
            "radial-gradient(ellipse at center, #1a1a1a 0%, #000 100%)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box sx={{ position: "relative" }}>
          <CircularProgress
            size={80}
            thickness={2}
            sx={{
              color: "#ff6b35",
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(
                "#ff6b35",
                0.2
              )} 0%, transparent 70%)`,
              animation: "pulse 2s ease-in-out infinite",
              "@keyframes pulse": {
                "0%": {
                  transform: "translate(-50%, -50%) scale(0.8)",
                  opacity: 1,
                },
                "50%": {
                  transform: "translate(-50%, -50%) scale(1.2)",
                  opacity: 0.5,
                },
                "100%": {
                  transform: "translate(-50%, -50%) scale(0.8)",
                  opacity: 1,
                },
              },
            }}
          />
        </Box>
        <Typography
          sx={{
            color: "white",
            fontSize: "1.2rem",
            letterSpacing: "0.05em",
            animation: "fadeInOut 2s ease-in-out infinite",
            "@keyframes fadeInOut": {
              "0%, 100%": { opacity: 0.5 },
              "50%": { opacity: 1 },
            },
          }}
        >
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  // Enhanced error state
  if (error || cryptoerror) {
    return (
      <Box
        sx={{
          background:
            "radial-gradient(ellipse at center, #1a1a1a 0%, #000 100%)",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GlowingPaper
          sx={{
            borderColor: "#ff4444",
            p: 4,
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: alpha("#ff4444", 0.1),
              border: `2px solid ${alpha("#ff4444", 0.3)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 2rem",
            }}
          >
            <Typography
              sx={{ color: "#ff4444", fontSize: "1.5rem", fontWeight: "bold" }}
            >
              !
            </Typography>
          </Box>
          <Typography
            sx={{
              color: "#ff4444",
              fontSize: "1.2rem",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Error Loading Data
          </Typography>
          <Typography sx={{ color: "#888", lineHeight: 1.6 }}>
            {error || cryptoerror}
          </Typography>
        </GlowingPaper>
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

  // Calculate stats
  const latestPrice =
    cryptoPrice.length > 0 ? cryptoPrice[cryptoPrice.length - 1].close : 0;
  const previousPrice =
    cryptoPrice.length > 1
      ? cryptoPrice[cryptoPrice.length - 2].close
      : latestPrice;
  const priceChange = ((latestPrice - previousPrice) / previousPrice) * 100;
  const avgSentiment =
    tweets.length > 0
      ? tweets.reduce((acc, t) => acc + t.sentimentRating, 0) / tweets.length
      : 0;

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        width: "100%",
        minHeight: "100vh",
        overflow: "visible !important",
        position: "relative",
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          px: 3,
          py: 3,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "1600px !important",
          margin: "0 auto",
        }}
      >
        {/* Enhanced Header */}
        <Fade in timeout={500}>
          <Box>
            <UserHeader
              username="@username"
              avgTimeframe="Short Term"
              accuracy={84}
            />
          </Box>
        </Fade>

        {/* Stats Row */}
        <Grow in timeout={700}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            <AnimatedStat
              label="Current Price"
              value={`$${latestPrice.toFixed(2)}`}
              icon={<ShowChart sx={{ color: "#ff6b35" }} />}
              trend={Number(priceChange.toFixed(2))}
            />
            <AnimatedStat
              label="24h Volume"
              value="$2.4B"
              icon={<Timeline sx={{ color: "#ff6b35" }} />}
            />
            <AnimatedStat
              label="Avg Sentiment"
              value={avgSentiment.toFixed(2)}
              icon={<Assessment sx={{ color: "#ff6b35" }} />}
            />
            <AnimatedStat
              label="Tweets Analyzed"
              value={tweets.length}
              icon={<Visibility sx={{ color: "#ff6b35" }} />}
            />
          </Box>
        </Grow>

        {/* Enhanced Controls Section */}
        <Grow in timeout={900}>
          <GlowingPaper sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              flexDirection={{ xs: "column", md: "row" }}
              gap={3}
            >
              <Box sx={{ width: { xs: "100%", md: "auto" } }}>
                <Typography
                  sx={{
                    color: "#ff6b35",
                    mb: 2,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
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
              <Box sx={{ width: { xs: "100%", md: "300px" } }}>
                <Typography
                  sx={{
                    color: "#ff6b35",
                    mb: 2,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Search Accounts
                </Typography>
                <SearchAccounts onSearch={setSearchTerm} />
              </Box>
            </Box>
          </GlowingPaper>
        </Grow>

        {/* Enhanced Trading Chart Section */}
        <Grow in timeout={1100}>
          <GlowingPaper sx={{ p: 3 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={3}
              flexWrap="wrap"
              gap={2}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                    letterSpacing: "-0.02em",
                  }}
                >
                  {selectedCoin} Price Chart
                </Typography>
                <Chip
                  label="LIVE"
                  size="small"
                  sx={{
                    backgroundColor: "#ff6b35",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "0.7rem",
                    animation: "pulse 2s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%, 100%": { opacity: 1 },
                      "50%": { opacity: 0.7 },
                    },
                  }}
                />
              </Box>
              <Box display="flex" gap={1}>
                {["1D", "1W", "1M", "3M", "1Y"].map((period) => (
                  <Chip
                    key={period}
                    label={period}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: alpha("#ff6b35", 0.3),
                      color: "#888",
                      "&:hover": {
                        borderColor: "#ff6b35",
                        color: "#ff6b35",
                        backgroundColor: alpha("#ff6b35", 0.1),
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Box
              sx={{
                width: "100%",
                height: "500px",
                backgroundColor: "#0a0a0a",
                borderRadius: 2,
                border: `1px solid ${alpha("#ff6b35", 0.2)}`,
                position: "relative",
                overflow: "hidden",
                boxShadow: `inset 0 0 20px ${alpha("#000", 0.5)}`,
              }}
            >
              {cryptoPrice.length > 0 ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <TradingChart candlestickdata={cryptoPrice} tweets={tweets} />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      border: `2px solid ${alpha("#ff6b35", 0.3)}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ShowChart sx={{ color: "#ff6b35", fontSize: 40 }} />
                  </Box>
                  <Typography sx={{ color: "#666", fontSize: "1.1rem" }}>
                    No chart data available for {selectedCoin}
                  </Typography>
                </Box>
              )}
            </Box>
          </GlowingPaper>
        </Grow>

        {/* Enhanced Tweet Analysis Section */}
        <Grow in timeout={1300}>
          <GlowingPaper sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
              flexWrap="wrap"
              gap={2}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                  letterSpacing: "-0.02em",
                }}
              >
                Sentiment Analysis
              </Typography>
              <Box display="flex" gap={2} alignItems="center">
                <Typography
                  sx={{
                    color: "white",
                    fontSize: "0.875rem",
                  }}
                >
                  {tweets.length} tweets analyzed
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Chip
                    label="Bullish"
                    clickable
                    sx={{
                      backgroundColor: "transparent",
                      border: "1px solid #4caf50",
                      color: "#4caf50",
                      fontSize: "0.75rem",
                      "&:hover": {
                        backgroundColor: alpha("#4caf50", 0.1),
                      },
                    }}
                  />
                  <Chip
                    label="Neutral"
                    clickable
                    sx={{
                      backgroundColor: "transparent",
                      border: "1px solid #999",
                      color: "#999",
                      fontSize: "0.75rem",
                      "&:hover": {
                        backgroundColor: alpha("#999", 0.1),
                      },
                    }}
                  />
                  <Chip
                    label="Bearish"
                    clickable
                    sx={{
                      backgroundColor: "transparent",
                      border: "1px solid #f44336",
                      color: "#f44336",
                      fontSize: "0.75rem",
                      "&:hover": {
                        backgroundColor: alpha("#f44336", 0.1),
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {tweets.length > 0 ? (
              <Box
                sx={{
                  backgroundColor: "#0a0a0a",
                  borderRadius: 2,
                  border: `1px solid ${alpha("#ff6b35", 0.2)}`,
                  overflow: "hidden",
                }}
              >
                <TweetTable records={tweets} />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 250,
                  backgroundColor: "#0a0a0a",
                  borderRadius: 2,
                  border: `1px solid ${alpha("#ff6b35", 0.2)}`,
                  gap: 3,
                  textAlign: "center",
                  p: 4,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    border: `2px solid ${alpha("#ff6b35", 0.3)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Assessment sx={{ color: "#ff6b35", fontSize: 40 }} />
                </Box>
                <Box>
                  <Typography sx={{ color: "#888", fontSize: "1.2rem", mb: 1 }}>
                    No tweet data available for {selectedCoin}
                  </Typography>
                  <Typography sx={{ color: "#666", fontSize: "0.95rem" }}>
                    Try selecting a different cryptocurrency or check back later
                  </Typography>
                </Box>
              </Box>
            )}
          </GlowingPaper>
        </Grow>

        {/* Bottom spacer */}
        <Box sx={{ height: "80px" }} />
      </Container>
    </Box>
  );
};

export default Dashboard;

/** Returns true if every `time` value is unique */
// export function areTimesUnique(data: CandlestickData[]): boolean {
//   const seen = new Set<Object>();
//   for (const { time } of data) {
//     if (seen.has(time)) return false;
//     seen.add(time);
//   }
//   return true;
// }

// /** Returns an array of duplicate timestamps (empty if none) */
// export function findDuplicateTimes(data: CandlestickData[]): Object[] {
//   const seen = new Set<Object>();
//   const dupes: Object[] = [];
//   for (const { time } of data) {
//     if (seen.has(time)) dupes.push(time);
//     else seen.add(time);
//   }
//   return Array.from(new Set(dupes));
// }