export const isUKBankAccount = (number: string) => /^\d{6,10}$/u.test(number);
