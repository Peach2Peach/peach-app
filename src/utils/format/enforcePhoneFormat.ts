export const enforcePhoneFormat = (number: string) =>
  number.length && !/^\+/gu.test(number) ? `+${number}` : number.replace(/[^0-9+]/gu, '')
