export const getTimeDiffInDays = (date: Date) => Math.floor((Date.now() - new Date(date).getTime()) / (86400 * 1000))
