'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export type MonitoringPoint = {
  source_id: string
  source_name: string
  value: number | null
  unit: string | null
  status: 'on' | 'off' | 'warn'
  metadata: Record<string, unknown>
  recorded_at: string
}

export function useMonitoringData() {
  const [data, setData] = useState<MonitoringPoint[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: rows } = await supabase
      .from('monitoring_data')
      .select('*')
      .order('recorded_at', { ascending: false })

    if (rows) {
      const seen = new Set<string>()
      const latest = rows.filter((r) => {
        if (seen.has(r.source_id)) return false
        seen.add(r.source_id)
        return true
      })
      setData(latest as MonitoringPoint[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  return { data, loading }
}
