/**
 * @description Method to group characters in sets
 */
export const groupChars = (string: string, sets: number): string =>
  string
    .split('')
    .reverse()
    .reduce((str, char, i) => (i % sets === 0 && i >= sets ? `${char} ${str}` : `${char}${str}`), '')
