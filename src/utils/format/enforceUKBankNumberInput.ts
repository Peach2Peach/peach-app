export const enforceUKBankNumberInputFormat = (text: string) =>
  text
    .split(' ')
    .join('')
    .replace(/[^0-9+]/gu, '')
