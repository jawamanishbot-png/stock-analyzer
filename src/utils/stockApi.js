const API_KEY = 'KRMXJ5ONUR07NQSC'
const BASE_URL = 'https://www.alphavantage.co/query'

// Delay between API calls (Alpha Vantage rate limit: 5 calls/min)
const DELAY = 1200

let lastCallTime = 0

async function throttledFetch(url) {
  const now = Date.now()
  const timeSinceLastCall = now - lastCallTime
  
  if (timeSinceLastCall < DELAY) {
    await new Promise(resolve => setTimeout(resolve, DELAY - timeSinceLastCall))
  }
  
  lastCallTime = Date.now()
  const response = await fetch(url)
  return response.json()
}

// Get current quote for a stock
export async function getStockQuote(symbol) {
  try {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    const data = await throttledFetch(url)
    
    if (data.Note) {
      throw new Error('API rate limit exceeded. Please try again in a moment.')
    }
    
    if (!data['Global Quote'] || !data['Global Quote']['05. price']) {
      throw new Error(`Stock not found: ${symbol}`)
    }
    
    const quote = data['Global Quote']
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      changeAmount: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent']),
      dayHigh: parseFloat(quote['03. high']),
      dayLow: parseFloat(quote['04. low']),
      volume: parseInt(quote['06. volume']),
      timestamp: quote['07. latest trading day'],
    }
  } catch (error) {
    console.error('Error fetching stock quote:', error)
    throw error
  }
}

// Get daily stock data (for chart)
export async function getStockDailyData(symbol, outputSize = 'compact') {
  try {
    const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputSize}&apikey=${API_KEY}`
    const data = await throttledFetch(url)
    
    if (data.Note) {
      throw new Error('API rate limit exceeded. Please try again in a moment.')
    }
    
    if (!data['Time Series (Daily)']) {
      throw new Error(`No data found for: ${symbol}`)
    }
    
    const timeSeries = data['Time Series (Daily)']
    const dates = Object.keys(timeSeries).sort().reverse().slice(0, 30).reverse()
    
    return dates.map(date => ({
      date,
      open: parseFloat(timeSeries[date]['1. open']),
      high: parseFloat(timeSeries[date]['2. high']),
      low: parseFloat(timeSeries[date]['3. low']),
      close: parseFloat(timeSeries[date]['4. close']),
      volume: parseInt(timeSeries[date]['5. volume']),
    }))
  } catch (error) {
    console.error('Error fetching daily data:', error)
    throw error
  }
}

// Get company overview (for metrics)
export async function getCompanyOverview(symbol) {
  try {
    const url = `${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
    const data = await throttledFetch(url)
    
    if (data.Note) {
      throw new Error('API rate limit exceeded. Please try again in a moment.')
    }
    
    if (!data.Name) {
      throw new Error(`Company not found: ${symbol}`)
    }
    
    return {
      name: data.Name,
      description: data.Description,
      marketCap: data.MarketCapitalization,
      peRatio: data.PERatio,
      eps: data.EPS,
      bookValue: data.BookValue,
      pe52week: data.PERatio,
      dividend: data.DividendPerShare,
      payoutRatio: data.PayoutRatio,
      beta: data.Beta,
      industry: data.Industry,
      sector: data.Sector,
      currency: data.Currency,
    }
  } catch (error) {
    console.error('Error fetching company overview:', error)
    throw error
  }
}

// Search for stocks (get top 5 matches)
export async function searchStocks(keywords) {
  try {
    const url = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${API_KEY}`
    const data = await throttledFetch(url)
    
    if (data.Note) {
      throw new Error('API rate limit exceeded. Please try again in a moment.')
    }
    
    if (!data.bestMatches) {
      return []
    }
    
    return data.bestMatches.slice(0, 5).map(match => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region'],
      marketOpen: match['5. marketOpen'],
      marketClose: match['6. marketClose'],
      timezone: match['7. timezone'],
      currency: match['8. currency'],
      matchScore: match['9. matchScore'],
    }))
  } catch (error) {
    console.error('Error searching stocks:', error)
    throw error
  }
}

// Get intraday data (last 100 data points)
export async function getIntradayData(symbol) {
  try {
    const url = `${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&apikey=${API_KEY}`
    const data = await throttledFetch(url)
    
    if (data.Note) {
      throw new Error('API rate limit exceeded. Please try again in a moment.')
    }
    
    const timeSeriesKey = Object.keys(data).find(key => key.includes('Time Series'))
    if (!timeSeriesKey) {
      throw new Error(`No intraday data found for: ${symbol}`)
    }
    
    const timeSeries = data[timeSeriesKey]
    const timestamps = Object.keys(timeSeries).sort().reverse().slice(0, 24)
    
    return timestamps.reverse().map(timestamp => ({
      timestamp,
      open: parseFloat(timeSeries[timestamp]['1. open']),
      high: parseFloat(timeSeries[timestamp]['2. high']),
      low: parseFloat(timeSeries[timestamp]['3. low']),
      close: parseFloat(timeSeries[timestamp]['4. close']),
      volume: parseInt(timeSeries[timestamp]['5. volume']),
    }))
  } catch (error) {
    console.error('Error fetching intraday data:', error)
    throw error
  }
}
