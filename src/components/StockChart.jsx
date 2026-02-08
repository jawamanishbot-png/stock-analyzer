import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { formatChartData, getDirectionColor } from '../utils/stockUtils'
import './StockChart.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function StockChart({ dailyData, symbol }) {
  if (!dailyData || dailyData.length === 0) {
    return <div className="chart-container"><p>No chart data available</p></div>
  }

  const chartData = formatChartData(dailyData)
  const changeAmount = dailyData[dailyData.length - 1].close - dailyData[0].close
  const trendColor = getDirectionColor(changeAmount)

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          color: '#f0f0f0',
        },
        ticks: {
          font: { size: 11 },
          color: '#666',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 10 },
          color: '#666',
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>{symbol} - 30 Day Price Chart</h3>
        <span className="chart-trend" style={{ color: trendColor }}>
          {changeAmount >= 0 ? '▲' : '▼'} {Math.abs(changeAmount).toFixed(2)}
        </span>
      </div>
      <div className="chart-wrapper">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}
