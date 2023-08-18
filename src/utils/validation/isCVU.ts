export const isCVU = (cvu: string) => {
  if (!cvu || cvu.length !== 22) return false
  return true
}
