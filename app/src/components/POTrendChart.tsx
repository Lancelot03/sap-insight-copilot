'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function POTrendChart({ data }: { data: Array<{ month: string; poCount: number }> }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="poCount" stroke="#7c3aed" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
