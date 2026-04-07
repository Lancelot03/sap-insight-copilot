'use client'

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function SpendChart({ data }: { data: Array<{ name: string; spend: number }> }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="spend" fill="#0A6ED1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
