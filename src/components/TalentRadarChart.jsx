import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as echarts from 'echarts'
import { mockUser, talentDimensions } from '../data/mockUser'
import { ArrowUpRight, X } from 'lucide-react'

const CHART_COLORS = {
  primary: '#FF8A00',
  primaryLight: '#FFB873',
  primaryBg: 'rgba(255, 138, 0, 0.2)',
  primaryBgLight: 'rgba(255, 138, 0, 0.05)',
  gridLine: 'rgba(43, 49, 63, 0.06)',
  gridArea: 'rgba(255, 138, 0, 0.04)',
  text: '#484338',
  tooltipBg: 'rgba(255, 255, 255, 0.96)',
}

export default function TalentRadarChart({ onDimensionClick }) {
  const chartRef = useRef(null)
  const [selectedDim, setSelectedDim] = useState(null)
  const [hoveredDim, setHoveredDim] = useState(null)
  const chartInstance = useRef(null)

  const selectedTalent = selectedDim
    ? talentDimensions.find(t => t.key === selectedDim)
    : null

  const selectedScore = selectedDim ? mockUser.talentScores[selectedDim] : 0

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    const chart = echarts.init(chartRef.current, null, { devicePixelRatio: 2 })
    chartInstance.current = chart

    const dimensions = Object.keys(mockUser.talentScores)
    const scores = Object.values(mockUser.talentScores)
    const dimData = dimensions.map((d, i) => {
      const info = talentDimensions.find(t => t.key === d)
      return { name: `${info?.icon || ''} ${d}`, value: scores[i], key: d }
    })

    const option = {
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      tooltip: {
        trigger: 'item',
        backgroundColor: CHART_COLORS.tooltipBg,
        borderColor: CHART_COLORS.primary,
        borderWidth: 1,
        borderRadius: 12,
        padding: [12, 16],
        textStyle: { color: CHART_COLORS.text, fontSize: 13 },
        formatter: (params) => {
          const d = dimData[params.dataIndex]
          const talent = talentDimensions.find(t => t.key === d.key)
          return `<div style="text-align:center">
            <span style="font-size:18px">${talent?.icon || ''}</span>
            <div style="font-weight:600;font-size:14px;margin-top:4px">${d.key}</div>
            <div style="font-size:24px;font-weight:700;color:#FF8A00;margin:4px 0">${d.value}</div>
            <div style="font-size:11px;color:#804300">${talent?.category || ''}</div>
            <div style="font-size:11px;color:#FF8A00;margin-top:4px">点击查看详情 →</div>
          </div>`
        },
      },
      radar: {
        center: ['50%', '52%'],
        radius: '55%',
        axisName: {
          color: CHART_COLORS.text,
          fontSize: 12,
          fontWeight: 500,
        },
        indicator: dimData.map(d => ({
          name: d.name,
          max: 100,
        })),
        shape: 'polygon',
        splitNumber: 5,
        axisNameGap: 5,
        splitArea: {
          areaStyle: {
            color: [CHART_COLORS.gridArea, 'rgba(255, 138, 0, 0.01)'],
          },
        },
        axisLine: {
          lineStyle: { color: CHART_COLORS.gridLine },
        },
        splitLine: {
          lineStyle: { color: CHART_COLORS.gridLine },
        },
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: scores,
              name: '天赋分布',
              symbol: 'circle',
              symbolSize: 7,
              lineStyle: {
                color: CHART_COLORS.primary,
                width: 2.5,
                shadowBlur: 8,
                shadowColor: 'rgba(255, 138, 0, 0.3)',
              },
              areaStyle: {
                color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                  { offset: 0, color: 'rgba(255, 138, 0, 0.25)' },
                  { offset: 0.5, color: 'rgba(255, 138, 0, 0.08)' },
                  { offset: 1, color: 'rgba(255, 138, 0, 0.01)' },
                ]),
              },
              itemStyle: {
                color: CHART_COLORS.primary,
                borderColor: '#fff',
                borderWidth: 2.5,
                shadowBlur: 6,
                shadowColor: 'rgba(255, 138, 0, 0.4)',
              },
              emphasis: {
                lineStyle: { width: 3 },
                itemStyle: {
                  shadowBlur: 12,
                  shadowColor: 'rgba(255, 138, 0, 0.6)',
                },
              },
            },
          ],
        },
      ],
    }

    chart.setOption(option)

    chart.on('click', (params) => {
      if (params.dataIndex !== undefined) {
        const key = dimData[params.dataIndex].key
        setSelectedDim(prev => prev === key ? null : key)
        onDimensionClick?.(key)
      }
    })

    chart.on('mouseover', (params) => {
      if (params.dataIndex !== undefined) {
        setHoveredDim(dimData[params.dataIndex].key)
      }
    })

    chart.on('mouseout', () => {
      setHoveredDim(null)
    })

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [])

  return (
    <div className="relative">
      <div ref={chartRef} className="w-full h-[250px]" />

      {/* 选中维度浮层 */}
      <AnimatePresence>
        {selectedDim && selectedTalent && (
          <motion.div
            key="popup"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute bottom-0 left-0 right-0 mx-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-hermes-200 z-10"
          >
            <button
              onClick={() => setSelectedDim(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{selectedTalent.icon}</span>
              <div>
                <h4 className="font-semibold text-slate-800">{selectedTalent.key}</h4>
                <p className="text-xs text-slate-500">{selectedTalent.category}</p>
              </div>
              <div className="ml-auto text-right">
                <span className="text-3xl font-bold text-hermes-600">{selectedScore}</span>
                <span className="text-xs text-slate-400 ml-1">分</span>
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">{selectedTalent.description}</p>
            <button
              onClick={() => onDimensionClick?.(selectedDim)}
              className="mt-3 w-full py-2.5 bg-hermes-500 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-hermes-600 transition-colors"
            >
              查看完整解读 <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部维度快捷标签 */}
    </div>
  )
}
