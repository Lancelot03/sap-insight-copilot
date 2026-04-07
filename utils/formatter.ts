export function toTitleCase(value: string): string {
  return value
    .split(' ')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ')
}
