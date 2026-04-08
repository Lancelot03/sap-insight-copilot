export function logInfo(message: string, context?: Record<string, unknown>) {
  console.info('[sap-insight-copilot]', message, context ?? {})
}
