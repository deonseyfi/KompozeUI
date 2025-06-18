import React, { useState, useEffect, useRef } from "react";
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
  Divider,
  Card,
  CardContent,
  Grid,
  Paper,
  Avatar,
  LinearProgress,
  Drawer,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import {
  ShowChart,
  Timeline,
  Assessment,
  Visibility,
  TrendingUp,
  TrendingDown,
  AccessTime,
  Person,
  Language,
  Star,
  Info,
  Menu as MenuIcon,
  Close as CloseIcon,
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
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState<
    "start" | "middle" | "end"
  >("start");
  const coinScrollRef = useRef<HTMLDivElement>(null);

  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

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

  // Process data
  const coinList: Coin[] = [];
  const cryptoPrice: CandlestickData[] = [];
  const tweets: any[] = [];

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

  // Enhanced scroll behavior with dual scrollbar styling
  React.useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    document.body.style.height = "auto";
    document.documentElement.style.height = "auto";
    document.body.style.backgroundColor = "#000";

    // Simple grey scrollbars everywhere
    const styleElement = document.createElement("style");
    styleElement.id = "custom-scrollbar-styles";
    styleElement.textContent = `
      /* Scrollbars - Only for specific elements that need visible scrollbars */
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #666 transparent;
      }
      
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #666;
        border-radius: 3px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #888;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:active {
        background: #555;
      }
      
      .custom-scrollbar::-webkit-scrollbar-corner {
        background: transparent;
      }
    `;

    // Remove existing custom scrollbar styles if they exist
    const existingStyles = document.getElementById("custom-scrollbar-styles");
    if (existingStyles) {
      existingStyles.remove();
    }

    document.head.appendChild(styleElement);

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.height = "";
      document.body.style.backgroundColor = "";

      // Remove custom scrollbar styles
      const styles = document.getElementById("custom-scrollbar-styles");
      if (styles) {
        styles.remove();
      }
    };
  }, []);

  // Handle coin list scroll position
  useEffect(() => {
    const handleCoinScroll = () => {
      if (coinScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = coinScrollRef.current;
        if (scrollLeft === 0) {
          setScrollPosition("start");
        } else if (scrollLeft + clientWidth >= scrollWidth - 1) {
          setScrollPosition("end");
        } else {
          setScrollPosition("middle");
        }
      }
    };

    const scrollContainer = coinScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleCoinScroll);
      handleCoinScroll(); // Initial check

      return () => {
        scrollContainer.removeEventListener("scroll", handleCoinScroll);
      };
    }
  }, []); // Empty dependency array - only run on mount/unmount

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
          gap: 4,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
        </Box>
        <Typography
          sx={{
            color: "#ff6b35",
            fontSize: "1.4rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Loading
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
          px: 2,
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

  // Mock data for demonstration
  const totalTweets = 1247;
  const bullishTweets = 523;
  const bearishTweets = 298;
  const neutralTweets = 426;
  const userAccuracy = 84.2;
  const userTimeframe = "Short Term";

  // Sidebar Content Components
  const LeftSidebarContent = () => (
    <Box sx={{ p: { xs: 2, md: 3 }, height: "100%" }}>
      {/* User Profile */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
            flexDirection: { xs: "column", sm: "row" },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Avatar
            sx={{
              width: { xs: 50, md: 60 },
              height: { xs: 50, md: 60 },
              backgroundColor: "#ff6b35",
              fontSize: { xs: "1.2rem", md: "1.5rem" },
              fontWeight: 600,
            }}
          >
            {selectedUser.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography
              sx={{
                color: "white",
                fontSize: { xs: "1rem", md: "1.2rem" },
                fontWeight: 600,
              }}
            >
              @{selectedUser}
            </Typography>
            <Typography
              sx={{
                color: "#888",
                fontSize: { xs: "0.8rem", md: "0.9rem" },
              }}
            >
              Crypto Trader
            </Typography>
          </Box>
        </Box>

        {/* User Stats */}
        <Box
          sx={{
            backgroundColor: "#111",
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            border: "1px solid #333",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography
              sx={{
                color: "#888",
                fontSize: { xs: "0.8rem", md: "0.9rem" },
              }}
            >
              Accuracy Score
            </Typography>
            <Typography
              sx={{
                color: "#4caf50",
                fontSize: { xs: "1rem", md: "1.1rem" },
                fontWeight: 600,
              }}
            >
              {userAccuracy}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={userAccuracy}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: "#333",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#4caf50",
                borderRadius: 3,
              },
            }}
          />
          <Typography
            sx={{
              color: "#888",
              fontSize: { xs: "0.7rem", md: "0.8rem" },
              mt: 1,
              textAlign: "center",
            }}
          >
            Avg. Trading Timeframe: {userTimeframe}
          </Typography>
        </Box>
      </Box>

      {/* Tweet Analysis Overview */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            color: "#ff6b35",
            fontSize: { xs: "0.9rem", md: "1rem" },
            fontWeight: 600,
            mb: 3,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Tweet Analysis
        </Typography>

        {/* Total Tweets */}
        <Box
          sx={{
            backgroundColor: "#111",
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            border: "1px solid #333",
            mb: 3,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              color: "#888",
              fontSize: { xs: "0.8rem", md: "0.9rem" },
              mb: 1,
            }}
          >
            Total Tweets Analyzed
          </Typography>
          <Typography
            sx={{
              color: "white",
              fontSize: { xs: "1.5rem", md: "2rem" },
              fontWeight: 700,
            }}
          >
            {totalTweets.toLocaleString()}
          </Typography>
        </Box>

        {/* Sentiment Breakdown */}
        <Box
          sx={{
            backgroundColor: "#111",
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            border: "1px solid #333",
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontSize: { xs: "0.9rem", md: "1rem" },
              fontWeight: 600,
              mb: 3,
              textAlign: "center",
            }}
          >
            Sentiment Breakdown
          </Typography>

          {/* Bullish */}
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#4caf50",
                  }}
                />
                <Typography
                  sx={{
                    color: "#4caf50",
                    fontSize: { xs: "0.8rem", md: "0.9rem" },
                  }}
                >
                  Bullish
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: "white",
                  fontSize: { xs: "0.8rem", md: "0.9rem" },
                }}
              >
                {bullishTweets}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(bullishTweets / totalTweets) * 100}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: "#333",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#4caf50",
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Bearish */}
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#f44336",
                  }}
                />
                <Typography
                  sx={{
                    color: "#f44336",
                    fontSize: { xs: "0.8rem", md: "0.9rem" },
                  }}
                >
                  Bearish
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: "white",
                  fontSize: { xs: "0.8rem", md: "0.9rem" },
                }}
              >
                {bearishTweets}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(bearishTweets / totalTweets) * 100}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: "#333",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#f44336",
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Neutral */}
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#999",
                  }}
                />
                <Typography
                  sx={{
                    color: "#999",
                    fontSize: { xs: "0.8rem", md: "0.9rem" },
                  }}
                >
                  Neutral
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: "white",
                  fontSize: { xs: "0.8rem", md: "0.9rem" },
                }}
              >
                {neutralTweets}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(neutralTweets / totalTweets) * 100}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: "#333",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#999",
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const RightSidebarContent = () => (
    <Box sx={{ p: { xs: 2, md: 3 }, height: "100%" }}>
      {/* Coin Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar
          src={getCoinIcon(selectedCoin.toLowerCase())}
          sx={{ width: { xs: 40, md: 50 }, height: { xs: 40, md: 50 } }}
        />
        <Box>
          <Typography
            sx={{
              color: "white",
              fontSize: { xs: "1.2rem", md: "1.4rem" },
              fontWeight: 700,
            }}
          >
            {selectedCoin}
          </Typography>
        
        </Box>
      </Box>

      {/* Price Information */}
      <Box
        sx={{
          mb: 4,
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontSize: { xs: "1.5rem", md: "2rem" },
            fontWeight: 600,
            mb: 1,
            lineHeight: 1,
            letterSpacing: "0.05em",
          }}
        >
          $
          {latestPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {priceChange >= 0 ? (
            <TrendingUp sx={{ color: "#4caf50", fontSize: 16 }} />
          ) : (
            <TrendingDown sx={{ color: "#f44336", fontSize: 16 }} />
          )}
          <Typography
            sx={{
              color: priceChange >= 0 ? "#4caf50" : "#f44336",
              fontSize: { xs: "0.9rem", md: "1rem" },
              fontWeight: 600,
            }}
          >
            {priceChange >= 0 ? "+" : ""}
            {priceChange.toFixed(2)}%
          </Typography>
          <Typography
            sx={{
              color: "#888",
              fontSize: { xs: "0.7rem", md: "0.8rem" },
            }}
          >
            24h
          </Typography>
        </Box>
      </Box>

      {/* Market Statistics */}
      <Box sx={{ mb: 3 }}>
        {[
          { label: "Market cap", value: "$2.07T" },
          { label: "Volume (24h)", value: "$47.05B" },
          { label: "Vol/Mkt Cap (24h)", value: "2.35%" },
          { label: "Circulating supply", value: `19.87M ${selectedCoin}` },
          { label: "Max. supply", value: `21M ${selectedCoin}` },
          { label: "FDV", value: "$2.19T" },
        ].map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              py: { xs: 1.5, md: 2 },
              borderBottom: index < 5 ? "1px solid #333" : "none",
            }}
          >
            <Typography
              sx={{
                color: "#888",
                fontSize: { xs: "0.8rem", md: "0.9rem" },
              }}
            >
              {item.label}
            </Typography>
            <Typography
              sx={{
                color: "white",
                fontSize: { xs: "0.8rem", md: "0.9rem" },
              }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Profile Score */}
      <Box
        sx={{
          backgroundColor: "#111",
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          border: "1px solid #333",
          mb: 3,
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontSize: { xs: "0.9rem", md: "1rem" },
            fontWeight: 600,
            mb: 2,
          }}
        >
          Profile score
        </Typography>
        <LinearProgress
          variant="determinate"
          value={100}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: "#333",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#4caf50",
              borderRadius: 4,
            },
          }}
        />
        <Typography
          sx={{
            color: "#4caf50",
            fontSize: { xs: "0.8rem", md: "0.9rem" },
            mt: 1,
            textAlign: "right",
          }}
        >
          100%
        </Typography>
      </Box>

      {/* Links */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            color: "white",
            fontSize: { xs: "0.9rem", md: "1rem" },
            fontWeight: 600,
            mb: 2,
          }}
        >
          Website
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Chip
            label="Website"
            size="small"
            icon={<Language />}
            sx={{
              backgroundColor: "#333",
              color: "white",
              "&:hover": {
                backgroundColor: "#444",
              },
            }}
          />
          <Chip
            label="Whitepaper"
            size="small"
            icon={<Info />}
            sx={{
              backgroundColor: "#333",
              color: "white",
              "&:hover": {
                backgroundColor: "#444",
              },
            }}
          />
        </Box>
      </Box>

      {/* Rating */}
      <Box>
        <Typography
          sx={{
            color: "white",
            fontSize: { xs: "0.9rem", md: "1rem" },
            fontWeight: 600,
            mb: 2,
          }}
        >
          Rating
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{
              color: "white",
              fontSize: { xs: "1rem", md: "1.1rem" },
            }}
          >
            4.4
          </Typography>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              sx={{
                color: star <= 4 ? "#ffd700" : "#333",
                fontSize: { xs: 16, md: 20 },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        width: "100%",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Mobile Header */}
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid #333",
            backgroundColor: "#0a0a0a",
          }}
        >
          <IconButton
            onClick={() => setLeftDrawerOpen(true)}
            sx={{ color: "white" }}
          >
            <Person />
          </IconButton>
          <Typography
            sx={{
              color: "white",
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            @{selectedUser}
          </Typography>
          <IconButton
            onClick={() => setRightDrawerOpen(true)}
            sx={{ color: "white" }}
          >
            <ShowChart />
          </IconButton>
        </Box>
      )}

      {/* Main Layout */}
      <Box
        sx={{
          display: "flex",
          height: { xs: "auto", md: "100vh" },
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Left Sidebar - Desktop */}
        {!isMobile && (
          <Box
            sx={{
              width: "320px",
              borderRight: "1px solid #333",
              backgroundColor: "#0a0a0a",
              height: "100vh",
              flexShrink: 0,
              overflowY: "auto",
              overflowX: "hidden",
              // Hide scrollbar but keep functionality
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <LeftSidebarContent />
          </Box>
        )}

        {/* Center Content */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, md: 4 },
            overflowY: { xs: "visible", md: "auto" },
            height: { xs: "auto", md: "100vh" },
            paddingTop: { xs: "1rem", md: "2rem" },
            paddingBottom: { xs: "1rem", md: "2rem" },
            // Hide scrollbar but keep functionality
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            // For touch devices
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Combined Chart Container with Coin Selection */}
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#0a0a0a",
              borderRadius: 2,
              border: `1px solid ${alpha("#ff6b35", 0.2)}`,
              mb: { xs: 3, md: 4 },
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Coin Selection Header */}
            <Box
              ref={coinScrollRef}
              sx={{
                p: 2,
                borderBottom: `1px solid ${alpha("#ff6b35", 0.1)}`,
                overflowX: "auto",
                overflowY: "hidden",
                scrollBehavior: "smooth",
                position: "relative",
                // Hide scrollbar but keep functionality
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                // Gradient fade indicators
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "30px",
                  background:
                    "linear-gradient(90deg, #0a0a0a 0%, transparent 100%)",
                  zIndex: 2,
                  pointerEvents: "none",
                  opacity: scrollPosition === "start" ? 0 : 1,
                  transition: "opacity 0.3s ease",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: "30px",
                  background:
                    "linear-gradient(270deg, #0a0a0a 0%, transparent 100%)",
                  zIndex: 2,
                  pointerEvents: "none",
                  opacity: scrollPosition === "end" ? 0 : 1,
                  transition: "opacity 0.3s ease",
                },
              }}
            >
              <Box sx={{ display: "inline-flex", gap: 1 }}>
                <CoinTabs
                  coins={coinList.length > 0 ? coinList : COINS}
                  selected={selectedCoin}
                  onChange={setSelectedCoin}
                />
              </Box>
            </Box>

            {/* Trading Chart */}
            <Box
              sx={{
                flex: 1,
                height: { xs: "300px", sm: "400px", md: "500px" },
                position: "relative",
              }}
            >
              {cryptoPrice.length > 0 ? (
                <TradingChart candlestickdata={cryptoPrice} tweets={tweets} />
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
                  <ShowChart
                    sx={{
                      color: "#ff6b35",
                      fontSize: { xs: 40, md: 60 },
                    }}
                  />
                  <Typography
                    sx={{
                      color: "#666",
                      fontSize: { xs: "1rem", md: "1.2rem" },
                      textAlign: "center",
                      px: 2,
                    }}
                  >
                    No chart data available for {selectedCoin}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Sentiment Analysis */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: 600,
                mb: { xs: 2, md: 3 },
                fontSize: { xs: "1.1rem", md: "1.25rem" },
              }}
            >
              Sentiment Analysis
            </Typography>

            {tweets.length > 0 ? (
              <Box
                sx={{
                  backgroundColor: "transparent",
                  width: "100%",
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
                  height: { xs: 200, md: 300 },
                  backgroundColor: "#0a0a0a",
                  borderRadius: 2,
                  border: `1px solid ${alpha("#ff6b35", 0.2)}`,
                  gap: 3,
                  textAlign: "center",
                  p: 2,
                }}
              >
                <Assessment
                  sx={{
                    color: "#ff6b35",
                    fontSize: { xs: 40, md: 60 },
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      color: "#888",
                      fontSize: { xs: "1rem", md: "1.2rem" },
                      mb: 1,
                    }}
                  >
                    No tweet data available for {selectedCoin}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#666",
                      fontSize: { xs: "0.8rem", md: "0.95rem" },
                    }}
                  >
                    Try selecting a different cryptocurrency
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Right Sidebar - Desktop */}
        {!isMobile && (
          <Box
            sx={{
              width: "300px",
              borderLeft: "1px solid #333",
              backgroundColor: "#0a0a0a",
              height: "100vh",
              flexShrink: 0,
              overflowY: "auto",
              overflowX: "hidden",
              // Hide scrollbar but keep functionality
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <RightSidebarContent />
          </Box>
        )}
      </Box>

      {/* Mobile Drawers */}
      <Drawer
        anchor="left"
        open={leftDrawerOpen}
        onClose={() => setLeftDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#0a0a0a",
            color: "white",
            width: { xs: "280px", sm: "320px" },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #333",
          }}
        >
          <Typography sx={{ color: "white", fontWeight: 600 }}>
            User Info
          </Typography>
          <IconButton
            onClick={() => setLeftDrawerOpen(false)}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <LeftSidebarContent />
      </Drawer>

      <Drawer
        anchor="right"
        open={rightDrawerOpen}
        onClose={() => setRightDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#0a0a0a",
            color: "white",
            width: { xs: "280px", sm: "300px" },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #333",
          }}
        >
          <Typography sx={{ color: "white", fontWeight: 600 }}>
            Coin Info
          </Typography>
          <IconButton
            onClick={() => setRightDrawerOpen(false)}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <RightSidebarContent />
      </Drawer>
    </Box>
  );
};

export default Dashboard;
