import './BottomNav.css'

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-button ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => onTabChange('home')}
        title="Home"
      >
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Home</span>
      </button>

      <button
        className={`nav-button ${activeTab === 'search' ? 'active' : ''}`}
        onClick={() => onTabChange('search')}
        title="Search"
      >
        <span className="nav-icon">🔍</span>
        <span className="nav-label">Search</span>
      </button>

      <button
        className={`nav-button ${activeTab === 'watchlist' ? 'active' : ''}`}
        onClick={() => onTabChange('watchlist')}
        title="Watchlist"
      >
        <span className="nav-icon">⭐</span>
        <span className="nav-label">Watchlist</span>
      </button>

      <button
        className={`nav-button ${activeTab === 'account' ? 'active' : ''}`}
        onClick={() => onTabChange('account')}
        title="Account"
      >
        <span className="nav-icon">👤</span>
        <span className="nav-label">Account</span>
      </button>
    </nav>
  )
}
