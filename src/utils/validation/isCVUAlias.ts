export const isCVUAlias = (alias: string) => {
  if (!alias || alias.length < 6 || alias.length > 20) return false
  return true
}
