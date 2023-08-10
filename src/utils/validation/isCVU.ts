export const isCVU = (cbu: string) => {
  if (!cbu || cbu.length !== 22) return false
  return true
}
