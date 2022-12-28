export const setDateToMidnight = (date: Date): Date => {
  const midnightTimestamp = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
  return new Date(midnightTimestamp)
}
