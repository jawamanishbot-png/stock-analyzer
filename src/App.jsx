import { useState, useEffect } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import StockCard from './components/StockCard'
import StockChart from './components/StockChart'
import { getStockQuote, getStockDailyData, getCompanyOverview, searchStocks } from './utils/stockApi'
import { useWatchlist } from './hooks/useWatchlist'
import './App.css'

export default function App() {
  const [currentTab, setCurrentTab] = useState('home')
  const [selectedStock, setSelectedStock] = useState(null)
  const [trendingStocks, setTrendingStocks] = useState([])
  const [dailyData, setDailyData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const { watchlist, toggleWatchlist, isInWatchlist } = useWatchlist()

  // Load trending stocks on mount
  useEffect(() => {
    loadTrendingStocks()
  }, [])

  const loadTrendingStocks = async () => {
    try {
      setLoading(true)
      const symbols = ['NVDA', 'MSFT', 'AAPL', 'GOOGL', 'TSLA']
      const nameMap = {
        'NVDA': 'NVIDIA Corporation',
        'MSFT': 'Microsoft Corporation',
        'AAPL': 'Apple Inc.',
        'GOOGL': 'Alphabet Inc.',
        'TSLA': 'Tesla Inc.',
      }
      
      const stocks = []
      for (const symbol of symbols) {
        try {
          const quote = await getStockQuote(symbol)
          stocks.push({
            symbol: quote.symbol,
            name: nameMap[symbol],
            price: quote.price,
            changeAmount: quote.changeAmount,
            changePercent: quote.changePercent,
            volume: quote.volume,
          })
          // Add delay between API calls to respect rate limit (5 calls/min)
          await new Promise(resolve => setTimeout(resolve, 1200))
        } catch (err) {
          console.error(`Error fetching ${symbol}:`, err.message)
        }
      }
      
      setTrendingStocks(stocks)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStockClick = async (stock) => {
    try {
      setLoading(true)
      const quote = await getStockQuote(stock.symbol)
      const daily = await getStockDailyData(stock.symbol)
      setSelectedStock(quote)
      setDailyData(daily)
      setCurrentTab('detail')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchInput.trim()) return
    try {
      setLoading(true)
      const results = await searchStocks(searchInput)
      setSearchResults(results.map(r => ({
        symbol: r.symbol,
        name: r.name,
        price: 0,
        changeAmount: 0,
        changePercent: 0,
        volume: 0
      })))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderHome = () => (
    <div className="home-screen">
      <div className="hero-section">
        <h2>Welcome back</h2>
        <p>Your portfolio</p>
      </div>

      <div className="trending-section">
        <h3>Trending</h3>
        <div className="trending-list">
          {trendingStocks.map(stock => (
            <div key={stock.symbol} className="trending-item" onClick={() => handleStockClick(stock)}>
              <div className="trending-left">
                <p className="trending-symbol">{stock.symbol}</p>
                <p className="trending-name">{stock.name}</p>
              </div>
              <div className="trending-right">
                <p className="trending-price">${stock.price.toFixed(2)}</p>
                <p className={`trending-change ${stock.changeAmount >= 0 ? 'positive' : 'negative'}`}>
                  {stock.changeAmount >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSearch = () => (
    <div className="search-screen">
      <div className="search-header">
        <input
          type="text"
          placeholder="Search stocks..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="search-input-large"
        />
        <button onClick={handleSearch} className="search-btn">Search</button>
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map(stock => (
            <div key={stock.symbol} onClick={() => handleStockClick(stock)} className="search-result-item">
              <p>{stock.symbol}</p>
              <p className="text-gray">{stock.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderWatchlist = () => (
    <div className="watchlist-screen">
      <h2>Your Watchlist</h2>
      {watchlist.length === 0 ? (
        <p className="empty-state">No stocks saved yet</p>
      ) : (
        <div className="watchlist-items">
          {watchlist.map(item => {
            const stock = trendingStocks.find(s => s.symbol === item.symbol)
            return stock ? (
              <div key={item.symbol} onClick={() => handleStockClick(stock)} className="watchlist-item">
                <p>{stock.symbol}</p>
                <p>${stock.price.toFixed(2)}</p>
              </div>
            ) : null
          })}
        </div>
      )}
    </div>
  )

  const renderDetail = () => (
    <div className="detail-screen">
      <button className="back-btn" onClick={() => setCurrentTab('home')}>← Back</button>
      
      {selectedStock && (
        <>
          <div className="detail-header">
            <div>
              <h2>{selectedStock.symbol}</h2>
              <p className="detail-price">${selectedStock.price.toFixed(2)}</p>
            </div>
            <button 
              className={`add-btn ${isInWatchlist(selectedStock.symbol) ? 'added' : ''}`}
              onClick={() => toggleWatchlist(selectedStock.symbol)}
            >
              {isInWatchlist(selectedStock.symbol) ? '✓ Added' : '+ Add'}
            </button>
          </div>

          <p className={`detail-change ${selectedStock.changeAmount >= 0 ? 'positive' : 'negative'}`}>
            {selectedStock.changeAmount >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}% today
          </p>

          {dailyData && <StockChart dailyData={dailyData} symbol={selectedStock.symbol} />}
        </>
      )}
    </div>
  )

  const renderAccount = () => (
    <div className="account-screen">
      <h2>Account</h2>
      <div className="account-item">
        <p>Portfolio Value</p>
        <p className="account-value">$0.00</p>
      </div>
      <div className="account-item">
        <p>Cash Available</p>
        <p className="account-value">$0.00</p>
      </div>
      <p className="account-note">Sign in to enable real trading</p>
    </div>
  )

  return (
    <div className="app">
      {error && <div className="error-banner">❌ {error}</div>}
      
      <main className="main-content">
        {loading && <div className="loading-overlay">Loading...</div>}
        
        {currentTab === 'home' && renderHome()}
        {currentTab === 'search' && renderSearch()}
        {currentTab === 'watchlist' && renderWatchlist()}
        {currentTab === 'account' && renderAccount()}
        {currentTab === 'detail' && renderDetail()}
      </main>

      <BottomNav activeTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  )
}
