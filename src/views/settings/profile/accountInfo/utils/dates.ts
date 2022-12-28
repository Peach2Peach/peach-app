import i18n from '../../../../../utils/i18n'

export const getTimeDiffInDays = (date: Date) => Math.floor((Date.now() - new Date(date).getTime()) / (86400 * 1000))

export const getDateToDisplay = (date: Date) => {
  const newDate = new Date(date)
  const dateString = newDate.toLocaleDateString('en-GB')
  const numberOfDays = getTimeDiffInDays(newDate)
  const daysAgo
    = numberOfDays > 1
      ? i18n('profile.daysAgo', String(getTimeDiffInDays(newDate)))
      : numberOfDays === 1
        ? i18n('profile.yesterday')
        : i18n('profile.today')

  return `${dateString} (${daysAgo})`
}
