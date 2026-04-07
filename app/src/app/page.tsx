import { getHealthStatus } from '@/lib/cap'

export default async function HomePage() {
  const health = await getHealthStatus()

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-start justify-center gap-6 px-6">
      <span className="rounded-full bg-sapBlue/10 px-3 py-1 text-xs font-semibold tracking-wide text-sapBlue">
        Sprint 1 Bootstrap
      </span>
      <h1 className="text-4xl font-bold">SAP Insight Copilot</h1>
      <p className="max-w-2xl text-lg text-slate-700">
        CAP + Next.js + TypeScript + Tailwind starter ready for SAP BTP
        deployment.
      </p>
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <p className="text-sm text-slate-500">Backend health</p>
        <p className="text-xl font-semibold text-sapBlue">{health}</p>
      </div>
    </main>
  )
}
