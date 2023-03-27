export const groupChars = (string: string, sets: number, separator = ' '): string =>
  string
    .split('')
    .reverse()
    .reduce((str, char, i) => (i % sets === 0 && i >= sets ? `${char}${separator}${str}` : `${char}${str}`), '')
