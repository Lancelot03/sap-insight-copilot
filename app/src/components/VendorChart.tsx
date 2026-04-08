'use client'

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function VendorChart({ data }: { data: Array<{ vendor: string; spend: number }> }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="vendor" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="spend" fill="#0284c7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
