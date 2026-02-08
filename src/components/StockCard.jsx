import { formatPrice, formatPercent, formatLargeNumber, getDirectionEmoji, getDirectionColor } from '../utils/stockUtils'
import './StockCard.css'

export default function StockCard({ stock, onClick, onWatchlistToggle, isInWatchlist, showImage = true }) {
  const changeColor = getDirectionColor(stock.changeAmount)
  const directionEmoji = getDirectionEmoji(stock.changeAmount)

  return (
    <div className="stock-card" onClick={onClick}>
      <div className="stock-card-header">
        <div className="stock-info">
          <h3 className="stock-symbol">{stock.symbol}</h3>
          <p className="stock-name">{stock.name || stock.symbol}</p>
        </div>
        {onWatchlistToggle && (
          <button
            className={`watchlist-toggle ${isInWatchlist ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onWatchlistToggle()
            }}
            title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            ⭐
          </button>
        )}
      </div>

      <div className="stock-price-section">
        <div>
          <p className="stock-price">{formatPrice(stock.price)}</p>
          <p className="stock-change" style={{ color: changeColor }}>
            {directionEmoji} {formatPercent(stock.changePercent)}
          </p>
        </div>
      </div>

      <div className="stock-details">
        <span className="detail-item">
          <span className="detail-label">Vol:</span>
          <span className="detail-value">{formatLargeNumber(stock.volume)}</span>
        </span>
        {stock.marketCap && (
          <span className="detail-item">
            <span className="detail-label">Cap:</span>
            <span className="detail-value">{stock.marketCap}</span>
          </span>
        )}
      </div>
    </div>
  )
}
