const baseUrl = process.env.NEXT_PUBLIC_CAP_BASE_URL ?? 'http://localhost:4004'

export async function getJson(path: string) {
  const response = await fetch(`${baseUrl}${path}`, { cache: 'no-store' })
  return response.json()
}
