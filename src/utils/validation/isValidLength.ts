export const isValidLength = (number: string, limit: number[] | number) =>
  typeof limit === 'number'
    ? RegExp(`^\\d{${limit}}$`, 'u').test(number)
    : RegExp(`^\\d{${limit[0]},${limit[1]}}$`, 'u').test(number)
