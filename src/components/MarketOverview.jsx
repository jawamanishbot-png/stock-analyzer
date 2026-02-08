import './MarketOverview.css'

export default function MarketOverview({ marketData }) {
  if (!marketData) {
    return (
      <div className="market-overview">
        <p>Loading market data...</p>
      </div>
    )
  }

  return (
    <div className="market-overview">
      <h2>📊 Market Overview</h2>
      
      <div className="market-stats">
        <div className="stat-card bullish">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <p className="stat-label">Advancing</p>
            <p className="stat-value">{marketData.advancing || '0'}</p>
          </div>
        </div>

        <div className="stat-card bearish">
          <div className="stat-icon">📉</div>
          <div className="stat-content">
            <p className="stat-label">Declining</p>
            <p className="stat-value">{marketData.declining || '0'}</p>
          </div>
        </div>

        <div className="stat-card neutral">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <p className="stat-label">New Highs</p>
            <p className="stat-value">{marketData.newHighs || '0'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
