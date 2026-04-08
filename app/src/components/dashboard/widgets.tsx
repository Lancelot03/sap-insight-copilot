'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { KpiCard } from './kpi-card'

type VendorSpendPoint = { vendor: string; spend: number }
type PlantPOPoint = { plant: string; count: number }
type MonthlyRevenuePoint = { month: string; revenue: number }
type ProfitCenterPoint = { pc: string; revenue: number }

type DashboardData = {
  poCount: number
  vendorSpend: VendorSpendPoint[]
  plantPO: PlantPOPoint[]
  monthlyRevenue: MonthlyRevenuePoint[]
  profitCenterRevenue: ProfitCenterPoint[]
}

const BASE_URL = process.env.NEXT_PUBLIC_CAP_BASE_URL ?? 'http://localhost:4004'

const DEFAULT_VENDOR_SPEND: VendorSpendPoint[] = [
  { vendor: 'VEND-001', spend: 2051.25 },
  { vendor: 'VEND-002', spend: 500 },
  { vendor: 'VEND-003', spend: 980 },
]

const DEFAULT_PLANT_PO: PlantPOPoint[] = [
  { plant: 'PL01', count: 2 },
  { plant: 'PL02', count: 1 },
  { plant: 'PL03', count: 1 },
]

const DEFAULT_PROFIT_CENTER: ProfitCenterPoint[] = [
  { pc: 'PC-100', revenue: 20500 },
  { pc: 'PC-200', revenue: 11900 },
]

const DEFAULT_MONTHLY_REVENUE: MonthlyRevenuePoint[] = [
  { month: '2026-01', revenue: 20500 },
  { month: '2026-02', revenue: 11900 },
]

function fallbackData(): DashboardData {
  return {
    poCount: 2,
    vendorSpend: DEFAULT_VENDOR_SPEND,
    plantPO: DEFAULT_PLANT_PO,
    monthlyRevenue: DEFAULT_MONTHLY_REVENUE,
    profitCenterRevenue: DEFAULT_PROFIT_CENTER,
  }
}

async function loadDashboardData(): Promise<DashboardData> {
  const [poCountResponse, monthlyRevenueResponse] = await Promise.all([
    fetch(`${BASE_URL}/odata/v4/mm/getPOCount(material='MAT-1000')`).then((r) => r.json()),
    fetch(`${BASE_URL}/odata/v4/fi/getMonthlyRevenue()`).then((r) => r.json()),
  ])

  return {
    poCount: poCountResponse?.poCount ?? 0,
    vendorSpend: DEFAULT_VENDOR_SPEND,
    plantPO: DEFAULT_PLANT_PO,
    monthlyRevenue:
      monthlyRevenueResponse?.monthly?.map((item: { month: string; revenue: number }) => ({
        month: item.month,
        revenue: Number(item.revenue),
      })) ?? DEFAULT_MONTHLY_REVENUE,
    profitCenterRevenue: DEFAULT_PROFIT_CENTER,
  }
}

export function DashboardWidgets() {
  const [data, setData] = useState<DashboardData>(fallbackData())
  const [status, setStatus] = useState<'loading' | 'connected' | 'fallback'>('loading')

  useEffect(() => {
    let mounted = true

    void loadDashboardData()
      .then((payload) => {
        if (!mounted) return
        setData(payload)
        setStatus('connected')
      })
      .catch(() => {
        if (!mounted) return
        setData(fallbackData())
        setStatus('fallback')
      })

    return () => {
      mounted = false
    }
  }, [])

  const revenueTotal = useMemo(
    () => data.monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0).toLocaleString('en-US'),
    [data.monthlyRevenue],
  )

  return (
    <section className="mx-auto w-full max-w-7xl space-y-4 px-3 py-4 sm:px-6 sm:py-6">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Enterprise Dashboard</h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            status === 'connected' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}
        >
          {status === 'loading' ? 'Loading...' : status === 'connected' ? 'API connected' : 'Fallback data'}
        </span>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="PO Count KPI" value={data.poCount} hint="Material MAT-1000" />
        <KpiCard label="Monthly Revenue" value={`$${revenueTotal}`} hint="Aggregated from FI API" />
        <KpiCard label="Top Vendor" value={data.vendorSpend[0]?.vendor ?? '-'} hint="By spend" />
        <KpiCard label="Top Profit Center" value={data.profitCenterRevenue[0]?.pc ?? '-'} hint="By revenue" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Vendor Spend Chart</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={data.vendorSpend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vendor" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="spend" fill="#0A6ED1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Plant-wise PO Chart</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={data.plantPO}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plant" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#6b7280" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Monthly Revenue Line Chart</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <LineChart data={data.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Profit Center Bar Chart</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={data.profitCenterRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pc" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
    </section>
  )
}
