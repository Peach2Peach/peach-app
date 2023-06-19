import i18n from '../i18n'

/**
 * @returns date in short format (today, yesterday, dd/mm/yy)
 */
export const getShortDateFormat = (date: Date) => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === today.toDateString()) {
    return i18n('today')
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return i18n('yesterday')
  }
  return date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: '2-digit' })
}
