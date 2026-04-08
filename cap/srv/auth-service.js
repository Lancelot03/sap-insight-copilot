function hasAnyRole(req, roles) {
  return Boolean(req.user && typeof req.user.is === 'function' && roles.some((r) => req.user.is(r)))
}

module.exports = { hasAnyRole }
