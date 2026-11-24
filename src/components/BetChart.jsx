import { useEffect, useRef } from 'react'
import { createChart, CandlestickSeries } from 'lightweight-charts'

export default function BetChart({ bets }) {
  const containerRef = useRef(null)
  const chartRef = useRef(null)
  const seriesRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      height: 400,
      layout: { 
        background: { color: '#1e222d' }, 
        textColor: '#d1d4dc',
        fontFamily: 'Inter, sans-serif'
      },
      grid: {
        vertLines: { color: '#2a2e39' },
        horzLines: { color: '#2a2e39' },
      },
      timeScale: { borderColor: '#2a2e39', timeVisible: true },
      rightPriceScale: { borderColor: '#2a2e39' },
      crosshair: {
        mode: 1,
        vertLine: { color: '#758696', labelBackgroundColor: '#2a2e39' },
        horzLine: { color: '#758696', labelBackgroundColor: '#2a2e39' },
      },
    })

    // On utilise CandlestickSeries pour les chandeliers japonais
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#089981',       
      downColor: '#f23645',     
      borderVisible: false,
      wickUpColor: '#089981',
      wickDownColor: '#f23645',
    })

    chartRef.current = chart
    seriesRef.current = series

    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth })
      }
    })
    ro.observe(containerRef.current)

    return () => {
      ro.disconnect()
      chart.remove()
    }
  }, [])

  useEffect(() => {
    if (!seriesRef.current || !chartRef.current) return

    const dailyData = {}
    bets.forEach(b => {
      if (b.result === 'pending') return
      const d = b.bet_date
      if (!dailyData[d]) {
        dailyData[d] = { profit: 0 }
      }
      dailyData[d].profit += Number(b.profit)
    })

    let currentCapital = 1000 // Capital de départ fictif
    let prevCapital = currentCapital
    const candleData = []

    Object.keys(dailyData).sort().forEach(date => {
      prevCapital = currentCapital
      currentCapital += dailyData[date].profit
      
      const open = prevCapital
      const close = currentCapital
      const high = Math.max(open, close) + Math.random() * 5
      const low = Math.min(open, close) - Math.random() * 5

      // On s'assure que toutes les valeurs sont bien des nombres
      candleData.push({
        time: date, 
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
      })
    })

    if (candleData.length > 0) {
      seriesRef.current.setData(candleData)
      chartRef.current.timeScale().fitContent()
    } else {
      seriesRef.current.setData([]) // Vide le graphique s'il n'y a pas de données
    }
  }, [bets])

  return (
    <div ref={containerRef} className="w-full" />
  )
}