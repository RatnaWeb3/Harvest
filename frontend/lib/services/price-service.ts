/**
 * Price Service
 * Fetches token prices from CoinGecko API with caching
 */

interface PriceCache {
  price: number
  timestamp: number
}

const PRICE_CACHE: Map<string, PriceCache> = new Map()
const CACHE_TTL = 60000 // 1 minute

// CoinGecko ID mappings for tokens
const COINGECKO_IDS: Record<string, string> = {
  MOVE: 'movement',
  APT: 'aptos',
  USDC: 'usd-coin',
  USDT: 'tether',
  ETH: 'ethereum',
  WETH: 'ethereum',
  BTC: 'bitcoin',
  WBTC: 'wrapped-bitcoin',
}

// Fallback prices for when API is unavailable (testnet development)
const FALLBACK_PRICES: Record<string, number> = {
  MOVE: 1.25,
  APT: 8.5,
  USDC: 1.0,
  USDT: 1.0,
  ETH: 3200,
  WETH: 3200,
  BTC: 95000,
  WBTC: 95000,
}

/**
 * Get token price in USD
 * Uses CoinGecko API with caching and fallbacks
 */
export async function getTokenPrice(symbol: string): Promise<number> {
  const upperSymbol = symbol.toUpperCase()

  // Check cache first
  const cached = PRICE_CACHE.get(upperSymbol)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.price
  }

  const coingeckoId = COINGECKO_IDS[upperSymbol]
  if (!coingeckoId) {
    console.warn(`[Price] Unknown token: ${upperSymbol}, using fallback`)
    return FALLBACK_PRICES[upperSymbol] || 0
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`,
      {
        next: { revalidate: 60 },
        headers: { Accept: 'application/json' },
      }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()
    const price = data[coingeckoId]?.usd || 0

    if (price > 0) {
      PRICE_CACHE.set(upperSymbol, { price, timestamp: Date.now() })
      console.log(`[Price] ${upperSymbol}: $${price}`)
      return price
    }

    throw new Error('Invalid price data')
  } catch (error) {
    console.error(`[Price] Failed to fetch ${upperSymbol}:`, error)
    // Return cached value if available (even if stale)
    if (cached) {
      console.log(`[Price] Using stale cache for ${upperSymbol}`)
      return cached.price
    }
    // Fall back to hardcoded prices for development
    const fallback = FALLBACK_PRICES[upperSymbol] || 0
    console.log(`[Price] Using fallback for ${upperSymbol}: $${fallback}`)
    return fallback
  }
}

/**
 * Get multiple token prices at once
 * More efficient than individual calls
 */
export async function getTokenPrices(
  symbols: string[]
): Promise<Record<string, number>> {
  const uniqueSymbols = [...new Set(symbols.map((s) => s.toUpperCase()))]
  const prices: Record<string, number> = {}

  // Check which symbols need fetching
  const toFetch: string[] = []
  for (const symbol of uniqueSymbols) {
    const cached = PRICE_CACHE.get(symbol)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      prices[symbol] = cached.price
    } else {
      toFetch.push(symbol)
    }
  }

  if (toFetch.length === 0) {
    return prices
  }

  // Build CoinGecko query for uncached symbols
  const ids = toFetch
    .map((s) => COINGECKO_IDS[s])
    .filter(Boolean)
    .join(',')

  if (!ids) {
    // No valid CoinGecko IDs, use fallbacks
    for (const symbol of toFetch) {
      prices[symbol] = FALLBACK_PRICES[symbol] || 0
    }
    return prices
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
      {
        next: { revalidate: 60 },
        headers: { Accept: 'application/json' },
      }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()

    for (const symbol of toFetch) {
      const coingeckoId = COINGECKO_IDS[symbol]
      const price = data[coingeckoId]?.usd || FALLBACK_PRICES[symbol] || 0
      prices[symbol] = price
      if (price > 0) {
        PRICE_CACHE.set(symbol, { price, timestamp: Date.now() })
      }
    }
  } catch (error) {
    console.error('[Price] Batch fetch failed:', error)
    // Use fallbacks for all failed symbols
    for (const symbol of toFetch) {
      prices[symbol] = FALLBACK_PRICES[symbol] || 0
    }
  }

  return prices
}

/**
 * Clear price cache (useful for testing)
 */
export function clearPriceCache(): void {
  PRICE_CACHE.clear()
}
