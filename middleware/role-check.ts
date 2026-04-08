export function roleCheck(userRoles: string[], required: string[]): boolean {
  return required.some((role) => userRoles.includes(role))
}
