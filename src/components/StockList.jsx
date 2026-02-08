import StockCard from './StockCard'
import './StockList.css'

export default function StockList({ title, stocks, onStockClick, onWatchlistToggle, watchlist = [] }) {
  if (!stocks || stocks.length === 0) {
    return (
      <div className="stock-list">
        <h3>{title}</h3>
        <p className="empty-state">No stocks to display</p>
      </div>
    )
  }

  return (
    <div className="stock-list">
      <h3>{title}</h3>
      <div className="stocks-container">
        {stocks.map(stock => (
          <StockCard
            key={stock.symbol}
            stock={stock}
            onClick={() => onStockClick(stock)}
            onWatchlistToggle={() => onWatchlistToggle(stock.symbol)}
            isInWatchlist={watchlist.some(w => w.symbol === stock.symbol)}
          />
        ))}
      </div>
    </div>
  )
}
