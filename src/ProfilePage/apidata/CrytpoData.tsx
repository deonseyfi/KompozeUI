import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";


export interface CryptoPriceData {
  data: Object | null;
}

interface CMCState {
  cryptodata: CryptoPriceData | null;
  cryptoloading: boolean;
  cryptoerror: string | null;
}

/**
 * React hook to fetch crypto price data from `/crypto-price` API.
 * @param symbol - The cryptocurrency symbol (e.g., BTC, ETH).
 * @param timeStart - The start time for the data (ISO 8601 format).
 * @param timeEnd - The end time for the data (ISO 8601 format).
 * @param interval - The interval for the data (e.g., 1m, 5m, 1h).
 */
export const useCryptoPrice = (symbol: string, timeStart: string, timeEnd: string, interval: string) => {
  const [state, setState] = useState<CMCState>({
    cryptodata: null,
    cryptoloading: false,
    cryptoerror: null,
  });


  useEffect(() => {
    if (!symbol || !timeStart || !timeEnd || !interval) return;


    const fetchCryptoPrice = async () => {
      setState({ cryptodata: null, cryptoloading: true, cryptoerror: null });
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      try {
        const queryParams = new URLSearchParams({
          symbol,
          timeStart,
          timeEnd,
          interval,
        });

        const response = await fetch(`http://localhost:5001/crypto-price?${queryParams}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        setState({ cryptodata: result, cryptoloading: false, cryptoerror: null });
      } catch (error: any) {
        setState({ cryptodata: null, cryptoloading: false, cryptoerror: error.message });
      }
    };

    fetchCryptoPrice();
  }, [symbol, timeStart, timeEnd, interval]);
  return state;
};
