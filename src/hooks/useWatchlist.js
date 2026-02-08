import { useState, useEffect } from 'react'

const STORAGE_KEY = 'stock-watchlist'

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setWatchlist(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Error loading watchlist:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist))
      } catch (error) {
        console.error('Error saving watchlist:', error)
      }
    }
  }, [watchlist, loading])

  // Add stock to watchlist
  const addToWatchlist = (symbol) => {
    setWatchlist(prev => {
      // Check if already exists
      if (prev.some(item => item.symbol === symbol)) {
        return prev
      }
      return [
        ...prev,
        {
          symbol: symbol.toUpperCase(),
          addedAt: new Date().toISOString(),
        },
      ]
    })
  }

  // Remove stock from watchlist
  const removeFromWatchlist = (symbol) => {
    setWatchlist(prev =>
      prev.filter(item => item.symbol !== symbol.toUpperCase())
    )
  }

  // Check if stock is in watchlist
  const isInWatchlist = (symbol) => {
    return watchlist.some(item => item.symbol === symbol.toUpperCase())
  }

  // Toggle stock in/out of watchlist
  const toggleWatchlist = (symbol) => {
    if (isInWatchlist(symbol)) {
      removeFromWatchlist(symbol)
    } else {
      addToWatchlist(symbol)
    }
  }

  // Clear entire watchlist
  const clearWatchlist = () => {
    setWatchlist([])
  }

  // Get watchlist size
  const size = watchlist.length

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    clearWatchlist,
    size,
    loading,
  }
}
