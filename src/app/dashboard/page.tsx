'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { useMonitoringData } from '@/hooks/useMonitoringData'
import { useAuth } from '@/hooks/useAuth'

function generateChartData(baseValue: number, points = 48) {
  return Array.from({ length: points }, (_, i) => {
    const hour = Math.floor(i / 2)
    const min = i % 2 === 0 ? '00' : '30'
    const variation = (Math.random() - 0.5) * baseValue * 0.3
    const solarFactor = Math.sin((i / points) * Math.PI) // peaks at noon
    return {
      time: `${String(hour).padStart(2, '0')}:${min}`,
      value: Math.max(0, baseValue * solarFactor + variation),
    }
  })
}

const RANGE_CHIPS = ['1H', '24H', '7D']

const ALARMS = [
  { sev: 'critical', title: 'PUMP-03 motor overload', meta: '14:32 · breaker tripped · ack required' },
  { sev: 'med', title: 'Battery temp above warning', meta: '14:18 · 38.2°C · cooling fan engaged' },
  { sev: 'low', title: 'Scheduled maintenance due', meta: 'Tomorrow · GEN-B 1000hr service' },
]

export default function DashboardPage() {
  const { data, loading } = useMonitoringData()
  const { user, signOut } = useAuth()
  const [activeRange, setActiveRange] = useState('24H')
  const [activeSrc, setActiveSrc] = useState('solar')
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const solar = data.find(d => d.source_id === 'solar')
  const battery = data.find(d => d.source_id === 'battery')
  const grid = data.find(d => d.source_id === 'grid')
  const motors = data.filter(d => d.source_id.startsWith('motor'))

  const chartData = useMemo(
    () => generateChartData(solar?.value ?? 18.4),
    [solar?.value]
  )

  const alarmCount = ALARMS.filter(a => a.sev === 'critical').length

  const sources = [
    { id: 'solar', name: 'Solar Array', val: solar ? `${solar.value} kW` : '— kW', status: solar?.status ?? 'on' },
    { id: 'battery', name: 'Battery Bank', val: battery ? `${battery.value}%` : '—', status: battery?.status ?? 'on' },
    { id: 'grid', name: 'EDL Grid', val: grid?.status === 'on' ? 'on standby' : 'off', status: grid?.status ?? 'on' },
    { id: 'genA', name: 'Generator A', val: 'stopped', status: 'off' as const },
    { id: 'genB', name: 'Generator B', val: 'maintenance', status: 'warn' as const },
  ]

  return (
    <div className="bg-matrix-topbar min-h-screen py-8 pb-20">
      <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">

        {/* Header */}
        <div className="flex justify-between items-end flex-wrap gap-4 mb-7">
          <div>
            <h1 className="font-barlow font-bold uppercase text-[42px] text-matrix-ink leading-none">
              Site Overview · Bekaa Solar
            </h1>
            <div className="text-[14px] text-matrix-muted mt-1">
              Logged in as <b>{user?.email ?? '…'}</b> · Last sync 2 seconds ago
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span
              className="inline-flex items-center gap-2 font-mono text-[12px] text-matrix-success px-3.5 py-2"
              style={{ background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.25)', borderRadius: '2px' }}
            >
              <span
                className="w-2 h-2 rounded-full bg-matrix-success"
                style={{ animation: 'pulse-green 1.6s infinite' }}
              />
              LIVE · WebSocket
            </span>
            <button
              onClick={signOut}
              className="font-dm font-semibold uppercase text-[12px] px-4.5 py-2.5 text-matrix-ink border border-matrix-border rounded-xs bg-transparent cursor-pointer transition-all duration-150 hover:bg-matrix-navy hover:text-white hover:border-matrix-navy"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* KPI Row */}
        {loading ? (
          <div className="grid grid-cols-4 max-[900px]:grid-cols-2 gap-4 mb-6">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="bg-white border border-matrix-border rounded-xs p-6 animate-pulse">
                <div className="h-3 bg-matrix-border rounded w-1/2 mb-3" />
                <div className="h-10 bg-matrix-border rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 max-[900px]:grid-cols-2 gap-4 mb-6">
            {/* Solar */}
            <div className="bg-white border border-matrix-border rounded-xs p-6" style={{ borderTop: '3px solid #1B6FCC' }}>
              <div className="text-[11px] tracking-[.18em] uppercase text-matrix-muted font-semibold">Solar Generation</div>
              <div className="font-mono text-[34px] text-matrix-ink font-medium mt-2 mb-1 leading-none">
                {solar?.value ?? '18.4'} <span className="text-[14px] text-matrix-muted">kW</span>
              </div>
              <div className="font-mono text-[12px] text-matrix-success">▲ 4.2% vs avg</div>
            </div>
            {/* Battery */}
            <div className="bg-white border border-matrix-border rounded-xs p-6" style={{ borderTop: '3px solid #1B6FCC' }}>
              <div className="text-[11px] tracking-[.18em] uppercase text-matrix-muted font-semibold">Battery Charge</div>
              <div className="font-mono text-[34px] text-matrix-ink font-medium mt-2 mb-1 leading-none">
                {battery?.value ?? 87}<span className="text-[14px] text-matrix-muted">%</span>
              </div>
              <div className="font-mono text-[12px] text-matrix-success">Charging · 142 kW</div>
            </div>
            {/* Grid */}
            <div className="bg-white border border-matrix-border rounded-xs p-6" style={{ borderTop: '3px solid #1B6FCC' }}>
              <div className="text-[11px] tracking-[.18em] uppercase text-matrix-muted font-semibold">Grid (EDL)</div>
              <div className="font-mono text-[34px] text-matrix-ink font-medium mt-2 mb-1 leading-none">
                <span style={{ color: grid?.status === 'on' ? '#22C55E' : '#DC2626' }}>●</span> {grid?.status?.toUpperCase() ?? 'ON'}
              </div>
              <div className="font-mono text-[12px] text-matrix-success">Stable · 380 V</div>
            </div>
            {/* Alarms */}
            <div
              className="bg-white border border-matrix-border rounded-xs p-6"
              style={{ borderTop: `3px solid ${alarmCount > 0 ? '#DC2626' : '#1B6FCC'}` }}
            >
              <div className="text-[11px] tracking-[.18em] uppercase text-matrix-muted font-semibold">Active Alarms</div>
              <div
                className="font-mono text-[34px] font-medium mt-2 mb-1 leading-none"
                style={{ color: alarmCount > 0 ? '#DC2626' : '#1F2330' }}
              >
                {alarmCount}
              </div>
              <div className="font-mono text-[12px] text-matrix-red">1 critical · 1 medium</div>
            </div>
          </div>
        )}

        {/* Main grid: 2fr / 1fr */}
        <div className="grid max-[980px]:grid-cols-1 gap-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
          {/* Left panel */}
          <div className="bg-white border border-matrix-border rounded-xs p-6">
            {/* Chart header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-matrix-border">
              <h3 className="font-barlow font-bold uppercase text-[18px] tracking-[.04em] text-matrix-ink">
                Solar Array — Last {activeRange}
              </h3>
              <div className="flex gap-1.5">
                {RANGE_CHIPS.map(chip => (
                  <button
                    key={chip}
                    onClick={() => setActiveRange(chip)}
                    className="font-mono text-[10.5px] tracking-widest px-2.5 py-1 cursor-pointer"
                    style={{
                      border: '1px solid',
                      borderColor: activeRange === chip ? '#2A2F3A' : '#E2E8F0',
                      background: activeRange === chip ? '#2A2F3A' : 'transparent',
                      color: activeRange === chip ? '#fff' : '#64748B',
                      borderRadius: '0',
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div style={{ height: '200px' }}>
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1B6FCC" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#1B6FCC" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#64748B' }}
                      tickLine={false}
                      axisLine={false}
                      interval={7}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#64748B' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#2A2F3A',
                        border: 'none',
                        borderRadius: '2px',
                        color: '#fff',
                        fontSize: '11px',
                        fontFamily: 'JetBrains Mono',
                      }}
                      formatter={(v: unknown) => [`${(v as number).toFixed(1)} kW`, 'Solar']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#1B6FCC"
                      strokeWidth={2}
                      fill="url(#solarGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Motor grid */}
            <div className="flex justify-between items-center mt-6 mb-3 pb-3 border-b border-matrix-border">
              <h3 className="font-barlow font-bold uppercase text-[18px] tracking-[.04em] text-matrix-ink">Motor Status</h3>
            </div>
            <div className="grid grid-cols-3 max-[760px]:grid-cols-2 gap-3">
              {motors.length > 0 ? motors.map((m) => (
                <div
                  key={m.source_id}
                  className="p-3 text-center border border-matrix-border rounded-xs"
                  style={{ background: '#F8F9FB' }}
                >
                  <div className="font-mono text-[11px] text-matrix-muted tracking-widest uppercase">{m.source_id.replace('_', '-').toUpperCase()}</div>
                  <div
                    className="font-mono text-[22px] font-medium my-1.5"
                    style={{ color: m.status === 'off' ? '#DC2626' : '#1F2330' }}
                  >
                    {m.value?.toLocaleString() ?? '0'}
                  </div>
                  <div
                    className="text-[11px] uppercase tracking-[.16em] font-semibold"
                    style={{ color: m.status === 'on' ? '#22C55E' : '#DC2626' }}
                  >
                    {m.status === 'on' ? 'Running' : 'Stopped'}
                  </div>
                </div>
              )) : (
                /* Fallback static motors */
                [
                  { id: 'PUMP-01', rpm: '1,485', running: true },
                  { id: 'PUMP-02', rpm: '1,492', running: true },
                  { id: 'PUMP-03', rpm: '0', running: false },
                  { id: 'CONV-01', rpm: '980', running: true },
                  { id: 'FAN-01', rpm: '1,750', running: true },
                  { id: 'FAN-02', rpm: '1,748', running: true },
                ].map(m => (
                  <div key={m.id} className="p-3 text-center border border-matrix-border rounded-xs" style={{ background: '#F8F9FB' }}>
                    <div className="font-mono text-[11px] text-matrix-muted tracking-widest uppercase">{m.id}</div>
                    <div className="font-mono text-[22px] font-medium my-1.5" style={{ color: m.running ? '#1F2330' : '#DC2626' }}>{m.rpm}</div>
                    <div className="text-[11px] uppercase tracking-[.16em] font-semibold" style={{ color: m.running ? '#22C55E' : '#DC2626' }}>
                      {m.running ? 'Running' : 'Stopped'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-4">
            {/* Power Sources */}
            <div className="bg-white border border-matrix-border rounded-xs p-6">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-matrix-border">
                <h3 className="font-barlow font-bold uppercase text-[18px] tracking-[.04em] text-matrix-ink">Power Sources</h3>
              </div>
              {sources.map(src => (
                <button
                  key={src.id}
                  onClick={() => setActiveSrc(src.id)}
                  className="w-full flex justify-between items-center py-3 border-b border-matrix-border last:border-0 text-left cursor-pointer transition-all"
                  style={{
                    background: activeSrc === src.id ? '#2A2F3A' : 'transparent',
                    paddingLeft: activeSrc === src.id ? '12px' : '0',
                    paddingRight: activeSrc === src.id ? '12px' : '0',
                    border: activeSrc === src.id ? 'none' : undefined,
                    marginBottom: activeSrc === src.id ? '0' : undefined,
                  }}
                >
                  <span
                    className="flex items-center gap-2.5 font-medium text-[14px]"
                    style={{ color: activeSrc === src.id ? '#fff' : '#1F2330' }}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        background: src.status === 'on' ? '#22C55E' : src.status === 'warn' ? '#FFB200' : '#DC2626'
                      }}
                    />
                    {src.name}
                  </span>
                  <span className="font-mono text-[13.5px]" style={{ color: '#1B6FCC' }}>{src.val}</span>
                </button>
              ))}
            </div>

            {/* Active Alarms */}
            <div className="bg-white border border-matrix-border rounded-xs p-6">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-matrix-border">
                <h3 className="font-barlow font-bold uppercase text-[18px] tracking-[.04em] text-matrix-ink">Active Alarms</h3>
                <span className="font-mono text-[10.5px] tracking-widest px-2.5 py-1 text-matrix-muted" style={{ border: '1px solid #E2E8F0' }}>
                  {ALARMS.length} unread
                </span>
              </div>
              {ALARMS.map((alarm, i) => (
                <div key={i} className="flex gap-3 items-start py-3 border-b border-matrix-border last:border-0">
                  <span
                    className="w-1.5 h-8 shrink-0 mt-0.5"
                    style={{
                      background: alarm.sev === 'critical' ? '#DC2626' : alarm.sev === 'med' ? '#FFB200' : '#22C55E'
                    }}
                  />
                  <div className="flex-1">
                    <b className="block text-[13.5px] font-semibold text-matrix-ink">{alarm.title}</b>
                    <span className="font-mono text-[11.5px] text-matrix-muted mt-0.5 block">{alarm.meta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
