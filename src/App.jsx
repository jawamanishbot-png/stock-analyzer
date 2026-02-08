import { useState, useEffect } from 'react'
import Header from './components/Header'
import MarketOverview from './components/MarketOverview'
import StockList from './components/StockList'
import StockChart from './components/StockChart'
import { getStockQuote, getStockDailyData, getCompanyOverview, searchStocks } from './utils/stockApi'
import { useWatchlist } from './hooks/useWatchlist'
import './App.css'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home') // 'home' | 'detail' | 'watchlist'
  const [selectedStock, setSelectedStock] = useState(null)
  const [topGainers, setTopGainers] = useState([])
  const [topLosers, setTopLosers] = useState([])
  const [detailData, setDetailData] = useState(null)
  const [dailyData, setDailyData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, toggleWatchlist } = useWatchlist()

  // Load top gainers/losers on mount
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      // Mock data for top gainers/losers (in real app, would fetch from API)
      const gainers = [
        { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.50, changeAmount: 25.50, changePercent: 3.00, volume: 42500000 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', price: 380.90, changeAmount: 11.50, changePercent: 3.11, volume: 28300000 },
        { symbol: 'AAPL', name: 'Apple Inc.', price: 245.50, changeAmount: 6.00, changePercent: 2.50, volume: 52500000 },
      ]
      const losers = [
        { symbol: 'META', name: 'Meta Platforms', price: 480.20, changeAmount: -15.30, changePercent: -3.08, volume: 22100000 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 156.20, changeAmount: -2.05, changePercent: -1.30, volume: 31400000 },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.80, changeAmount: -8.50, changePercent: -3.39, volume: 125600000 },
      ]
      setTopGainers(gainers)
      setTopLosers(losers)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (symbol) => {
    try {
      setLoading(true)
      setError(null)
      const quote = await getStockQuote(symbol)
      const daily = await getStockDailyData(symbol)
      const overview = await getCompanyOverview(symbol)
      
      setDetailData({
        ...quote,
        ...overview,
      })
      setDailyData(daily)
      setSelectedStock(quote)
      setCurrentScreen('detail')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStockClick = async (stock) => {
    await handleSearch(stock.symbol)
  }

  const handleWatchlistToggle = (symbol) => {
    toggleWatchlist(symbol)
  }

  const renderHome = () => (
    <div className="home-screen">
      <MarketOverview marketData={{ advancing: '78.2%', declining: '18.4%', newHighs: '68.6%' }} />
      
      <StockList
        title="📈 Top Gainers"
        stocks={topGainers}
        onStockClick={handleStockClick}
        onWatchlistToggle={handleWatchlistToggle}
        watchlist={watchlist}
      />
      
      <StockList
        title="📉 Top Losers"
        stocks={topLosers}
        onStockClick={handleStockClick}
        onWatchlistToggle={handleWatchlistToggle}
        watchlist={watchlist}
      />
    </div>
  )

  const renderDetail = () => (
    <div className="detail-screen">
      <button className="back-button" onClick={() => setCurrentScreen('home')}>
        ← Back
      </button>
      
      {detailData && (
        <>
          <div className="stock-header">
            <h2>{selectedStock?.symbol} - {detailData.name}</h2>
            <button className="watchlist-toggle-detail" onClick={() => handleWatchlistToggle(selectedStock?.symbol)}>
              {isInWatchlist(selectedStock?.symbol) ? '⭐' : '☆'}
            </button>
          </div>
          
          <div className="price-display">
            <p className="price">${selectedStock?.price.toFixed(2)}</p>
            <p className={`change ${selectedStock?.changeAmount >= 0 ? 'positive' : 'negative'}`}>
              {selectedStock?.changeAmount >= 0 ? '▲' : '▼'} {Math.abs(selectedStock?.changeAmount).toFixed(2)} ({selectedStock?.changePercent.toFixed(2)}%)
            </p>
          </div>
          
          {dailyData && <StockChart dailyData={dailyData} symbol={selectedStock?.symbol} />}
          
          <div className="metrics-grid">
            <div className="metric">
              <span className="label">Day High</span>
              <span className="value">${selectedStock?.dayHigh.toFixed(2)}</span>
            </div>
            <div className="metric">
              <span className="label">Day Low</span>
              <span className="value">${selectedStock?.dayLow.toFixed(2)}</span>
            </div>
            <div className="metric">
              <span className="label">Volume</span>
              <span className="value">{(selectedStock?.volume / 1e6).toFixed(1)}M</span>
            </div>
            <div className="metric">
              <span className="label">P/E Ratio</span>
              <span className="value">{detailData.peRatio || 'N/A'}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )

  const renderWatchlist = () => (
    <div className="watchlist-screen">
      <button className="back-button" onClick={() => setCurrentScreen('home')}>
        ← Back
      </button>
      
      <h2>⭐ My Watchlist ({watchlist.length})</h2>
      
      {watchlist.length === 0 ? (
        <p className="empty-message">No stocks in your watchlist. Add some!</p>
      ) : (
        <StockList
          title=""
          stocks={watchlist.map(item => topGainers.find(g => g.symbol === item.symbol) || topLosers.find(l => l.symbol === item.symbol) || { symbol: item.symbol })}
          onStockClick={handleStockClick}
          onWatchlistToggle={handleWatchlistToggle}
          watchlist={watchlist}
        />
      )}
    </div>
  )

  return (
    <div className="app">
      <Header onSearch={handleSearch} onWatchlistClick={() => setCurrentScreen('watchlist')} />
      
      {error && <div className="error-message">❌ {error}</div>}
      
      <main className="main-content">
        {loading && <div className="loading">Loading...</div>}
        
        {!loading && (
          <>
            {currentScreen === 'home' && renderHome()}
            {currentScreen === 'detail' && renderDetail()}
            {currentScreen === 'watchlist' && renderWatchlist()}
          </>
        )}
      </main>
    </div>
  )
}
