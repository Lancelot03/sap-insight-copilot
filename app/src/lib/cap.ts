const baseUrl =
  process.env.NEXT_PUBLIC_CAP_BASE_URL ?? 'http://localhost:4004'

export async function getHealthStatus(): Promise<string> {
  try {
    const response = await fetch(`${baseUrl}/odata/v4/insight/HealthCheck`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return `DOWN (${response.status})`
    }

    const payload = (await response.json()) as {
      value?: Array<{ status?: string }>
    }

    return payload.value?.[0]?.status ?? 'UNKNOWN'
  } catch {
    return 'UNREACHABLE'
  }
}
