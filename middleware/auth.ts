export type SapUserContext = {
  id: string
  roles: string[]
  tenant?: string
}

export type CapRequestLike = {
  user?: {
    id?: string
    attr?: Record<string, string>
    is?: (role: string) => boolean
  }
  headers?: Record<string, string | undefined>
  reject: (status: number, message: string) => void
}

export function requireAuthentication(req: CapRequestLike): SapUserContext {
  if (!req.user) {
    req.reject(401, 'Unauthorized: SAP BTP user context not found')
    throw new Error('Unauthorized')
  }

  const id = req.user.id ?? 'unknown'
  const tenant = req.user.attr?.zone_uuid

  return {
    id,
    tenant,
    roles: [],
  }
}

export function requireAnyRole(req: CapRequestLike, roles: string[]): void {
  const isAllowed = roles.some((role) => req.user?.is?.(role))
  if (!isAllowed) {
    req.reject(403, `Forbidden: Missing required role (${roles.join(' | ')})`)
    throw new Error('Forbidden')
  }
}

export function enforceBtpAuth(req: CapRequestLike, roles: string[]): SapUserContext {
  const user = requireAuthentication(req)
  requireAnyRole(req, roles)
  return user
}
