export const isValidPayeerNumber = (accountNumber: string) =>
  /^P\d{10}$/u.test(accountNumber);
