import React, { useState, useEffect } from "react";
import "./CryptoTicker.css";

interface CryptoData {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
      percent_change_24h: number;
    };
  };
}

interface CoinMarketCapResponse {
  data: CryptoData[];
  status: {
    error_code: number;
    error_message?: string;
  };
}

const CryptoTickerBar: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CoinMarketCap API configuration
  const CMC_API_KEY =
    process.env.REACT_APP_CMC_API_KEY || "b0ab95cd-3412-4296-bf01-16319acde225";
  const CMC_API_URL = "/v1/cryptocurrency/listings/latest";

  // Crypto IDs to display (top cryptocurrencies by market cap)
  const cryptoIds = [
    1, 1027, 20396, 5690, 22974, 5426, 2010, 3890, 1975, 5805, 6636,
  ]; // BTC, ETH, SOL, ADA, MATIC, LINK, AVAX, DOT

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        `${CMC_API_URL}?start=1&limit=200&convert=USD`,
        {
          method: "GET",
          headers: {
            "X-CMC_PRO_API_KEY": CMC_API_KEY,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CoinMarketCapResponse = await response.json();

      if (data.status.error_code !== 0) {
        throw new Error(data.status.error_message || "API Error");
      }

      // Filter to get only the cryptocurrencies we want
      const filteredData = data.data.filter((crypto) =>
        cryptoIds.includes(crypto.id)
      );

      // Sort by the order in cryptoIds array
      const sortedData = cryptoIds
        .map((id) => filteredData.find((crypto) => crypto.id === id))
        .filter(Boolean) as CryptoData[];

      setCryptoData(sortedData);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error fetching crypto data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      setLoading(false);
    }
  };

  // Format price with appropriate decimals
  const formatPrice = (price: number): string => {
    if (price >= 1) {
      return `$${price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    } else {
      return `$${price.toFixed(4)}`;
    }
  };

  // Format percentage change (no sign for negative, + for positive)
  const formatChange = (change: number): string => {
    const formatted = Math.abs(change).toFixed(2);
    return change >= 0 ? `+${formatted}%` : `-${formatted}%`;
  };

  useEffect(() => {
    // Initial fetch
    fetchCryptoData();

    // Set up interval for real-time updates (every 60 seconds for CMC free tier)
    const interval = setInterval(fetchCryptoData, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="ticker-bar">
        <div className="ticker-content">
          <div className="loading-text">Loading prices...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ticker-bar">
        <div className="ticker-content">
          <div className="error-text">Unable to load prices</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ticker-bar">
      <div className="ticker-scroll">
        {/* First set of items */}
        {cryptoData.map((crypto) => (
          <div key={`${crypto.id}-1`} className="ticker-item">
            <span className="crypto-symbol">{crypto.symbol}</span>
            <span className="crypto-price">
              {formatPrice(crypto.quote.USD.price)}
            </span>
            <span
              className={`crypto-change ${
                crypto.quote.USD.percent_change_24h >= 0
                  ? "positive"
                  : "negative"
              }`}
            >
              {formatChange(crypto.quote.USD.percent_change_24h)}
            </span>
          </div>
        ))}

        {/* Duplicate set for seamless scrolling */}
        {cryptoData.map((crypto) => (
          <div key={`${crypto.id}-2`} className="ticker-item">
            <span className="crypto-symbol">{crypto.symbol}</span>
            <span className="crypto-price">
              {formatPrice(crypto.quote.USD.price)}
            </span>
            <span
              className={`crypto-change ${
                crypto.quote.USD.percent_change_24h >= 0
                  ? "positive"
                  : "negative"
              }`}
            >
              {formatChange(crypto.quote.USD.percent_change_24h)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoTickerBar;
