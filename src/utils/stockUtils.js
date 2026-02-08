// Format price to USD currency
export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

// Format percentage
export function formatPercent(percent) {
  return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`
}

// Format large numbers (e.g., 52500000 → 52.5M)
export function formatLargeNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toString()
}

// Format market cap
export function formatMarketCap(marketCap) {
  if (!marketCap) return 'N/A'
  const num = parseInt(marketCap)
  if (num >= 1e12) return '$' + (num / 1e12).toFixed(1) + 'T'
  if (num >= 1e9) return '$' + (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return '$' + (num / 1e6).toFixed(1) + 'M'
  return '$' + num.toString()
}

// Determine if price went up or down
export function getPriceDirection(changeAmount) {
  if (changeAmount > 0) return 'up'
  if (changeAmount < 0) return 'down'
  return 'neutral'
}

// Get emoji for direction
export function getDirectionEmoji(changeAmount) {
  if (changeAmount > 0) return '▲'
  if (changeAmount < 0) return '▼'
  return '→'
}

// Get color for direction
export function getDirectionColor(changeAmount) {
  if (changeAmount > 0) return '#10b981' // green
  if (changeAmount < 0) return '#ef4444' // red
  return '#6b7280' // gray
}

// Calculate change from price history
export function calculateChangeSince(currentPrice, historicalPrice) {
  if (!historicalPrice || historicalPrice === 0) return 0
  return ((currentPrice - historicalPrice) / historicalPrice) * 100
}

// Get 52-week high/low from daily data
export function get52WeekStats(dailyData) {
  if (!dailyData || dailyData.length === 0) {
    return { high: 0, low: 0 }
  }

  const closes = dailyData.map(d => d.close)
  return {
    high: Math.max(...closes),
    low: Math.min(...closes),
  }
}

// Format chart data
export function formatChartData(dailyData) {
  if (!dailyData || dailyData.length === 0) {
    return { labels: [], datasets: [] }
  }

  const labels = dailyData.map(d => formatDate(d.date))
  const data = dailyData.map(d => d.close)

  return {
    labels,
    datasets: [
      {
        label: 'Close Price',
        data,
        borderColor: '#0a66c2',
        backgroundColor: 'rgba(10, 102, 194, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#0a66c2',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  }
}

// Format date (e.g., "2026-02-07" → "Feb 7")
export function formatDate(dateStr) {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

// Parse stock symbol (remove spaces, uppercase)
export function normalizeSymbol(symbol) {
  return symbol.trim().toUpperCase()
}

// Validate stock symbol format
export function isValidSymbol(symbol) {
  // Stock symbols are 1-5 characters, alphanumeric
  return /^[A-Z0-9]{1,5}$/.test(symbol.trim().toUpperCase())
}

// Get trend from price history
export function getTrend(dailyData) {
  if (!dailyData || dailyData.length < 2) return 'neutral'

  const firstPrice = dailyData[0].close
  const lastPrice = dailyData[dailyData.length - 1].close
  const change = lastPrice - firstPrice

  if (change > 0) return 'bullish'
  if (change < 0) return 'bearish'
  return 'neutral'
}

// Get trend description
export function getTrendDescription(dailyData) {
  const trend = getTrend(dailyData)
  const percent = calculateChangeSince(
    dailyData[dailyData.length - 1]?.close,
    dailyData[0]?.close
  )

  if (trend === 'bullish') return `📈 Up ${formatPercent(percent)}`
  if (trend === 'bearish') return `📉 Down ${formatPercent(Math.abs(percent))}`
  return '→ Neutral'
}
