import { useState } from 'react'
import './Header.css'

export default function Header({ onSearch, onWatchlistClick }) {
  const [searchInput, setSearchInput] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setIsSearching(true)
      onSearch(searchInput)
      setSearchInput('')
      setIsSearching(false)
    }
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">📈</span>
            <h1>StockFind</h1>
          </div>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search stocks (e.g., AAPL, GOOGL)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="search-button" disabled={isSearching}>
              🔍
            </button>
          </form>

          <button className="watchlist-button" onClick={onWatchlistClick}>
            ⭐
          </button>
        </div>
      </div>
    </header>
  )
}
