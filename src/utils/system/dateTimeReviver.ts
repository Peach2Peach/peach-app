import { isDateString } from '../validation'

export const dateTimeReviver = (key: string, value: string | number | boolean | object | null) => {
  if (typeof value === 'string' && isDateString(value)) {
    const dateCandidate = new Date(value)
    if (!isNaN(dateCandidate.valueOf())) {
      return dateCandidate
    }
  }
  return value
}
