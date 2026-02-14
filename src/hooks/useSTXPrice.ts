/**
 * useSTXPrice Hook
 * 
 * Fetches and caches STX price in USD from CoinGecko API directly (frontend only).
 * Updates every 5 minutes to keep prices relatively fresh.
 * 
 * Note: Frontend reads STX values from Supabase and converts to USD here.
 * Backend has no knowledge of prices.
 */

import { useState, useEffect } from 'react';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CoinGeckoResponse {
  blockstack?: {
    usd?: number;
  };
  [key: string]: any;
}

let globalPriceCache: { price: number; timestamp: number } | null = null;

async function fetchSTXPriceFromCoinGecko(): Promise<number> {
  // Use cached price if available and fresh
  if (globalPriceCache && Date.now() - globalPriceCache.timestamp < CACHE_DURATION) {
    return globalPriceCache.price;
  }

  try {
    const response = await fetch(
      `${COINGECKO_API_URL}?ids=blockstack&vs_currencies=usd`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json() as CoinGeckoResponse;
    const price = data?.blockstack?.usd;

    if (!price || typeof price !== 'number') {
      throw new Error('Invalid price data from CoinGecko');
    }

    // Cache the price
    globalPriceCache = {
      price,
      timestamp: Date.now(),
    };

    return price;
  } catch (error) {
    console.error('Error fetching STX price from CoinGecko:', error);
    
    // Return cached price if available, otherwise fallback
    if (globalPriceCache) {
      console.warn('Using cached STX price due to API error');
      return globalPriceCache.price;
    }

    // Fallback to approximate price
    console.warn('Using fallback STX price: $1.50');
    return 1.50;
  }
}

export function useSTXPrice() {
  const [price, setPrice] = useState<number>(1.50); // Default fallback
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const stxPrice = await fetchSTXPriceFromCoinGecko();
        setPrice(stxPrice);
      } catch (error) {
        console.error('Error fetching STX price:', error);
        // Use cached price if available, otherwise keep default
        if (globalPriceCache) {
          setPrice(globalPriceCache.price);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    
    // Refresh price every 5 minutes
    const interval = setInterval(fetchPrice, CACHE_DURATION);
    
    return () => clearInterval(interval);
  }, []);

  /**
   * Convert STX to USD
   */
  const stxToUSD = (stxAmount: number): number => {
    return stxAmount * price;
  };

  /**
   * Convert microSTX to USD
   */
  const microstxToUSD = (microstxAmount: number): number => {
    return (microstxAmount / 1000000) * price;
  };

  /**
   * Format USD amount with currency symbol
   */
  const formatUSD = (usdAmount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usdAmount);
  };

  return {
    price,
    loading,
    stxToUSD,
    microstxToUSD,
    formatUSD,
  };
}

