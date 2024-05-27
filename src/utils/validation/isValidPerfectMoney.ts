export const isValidPerfectMoney = (accountNumber: string) =>
  /^[UEG]\d{8}$/u.test(accountNumber);
