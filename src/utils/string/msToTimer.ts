export const msToTimer = (ms: number): string => {
  const hours = Math.floor(ms / 1000 / 60 / 60)
  ms -= hours * 60 * 60 * 1000
  const minutes = Math.floor(ms / 1000 / 60)
  ms -= minutes * 60 * 1000
  const seconds = Math.floor(ms / 1000)
  ms -= seconds * 1000

  return [hours, minutes, seconds].map((num) => num.toString().padStart(2, '0')).join(':')
}
