/**
 * @returns date in short format (dd/mm/yy)
 */
export const getShortDateFormat = (date: Date) => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  return date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: '2-digit' }).replaceAll('/', ' / ')
}
