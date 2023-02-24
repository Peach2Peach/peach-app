export const enforceUKBankNumberFormat = (text: string) => text.replace(/[^0-9+]/gu, '')
