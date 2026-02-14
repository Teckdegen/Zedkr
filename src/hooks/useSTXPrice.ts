/**
 * useSTXPrice Hook
 * 
 * Fetches and caches STX price in USD for displaying USD equivalents.
 * Updates every 5 minutes to keep prices relatively fresh.
 */

import { useState, useEffect } from 'react';
import { getSTXPriceUSD } from '@/lib/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

let globalPriceCache: { price: number; timestamp: number } | null = null;

export function useSTXPrice() {
  const [price, setPrice] = useState<number>(1.50); // Default fallback
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      // Use cached price if available and fresh
      if (globalPriceCache && Date.now() - globalPriceCache.timestamp < CACHE_DURATION) {
        setPrice(globalPriceCache.price);
        setLoading(false);
        return;
      }

      try {
        const stxPrice = await getSTXPriceUSD();
        globalPriceCache = {
          price: stxPrice,
          timestamp: Date.now(),
        };
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

