export const isValidPerfectMoney = (accountNumber: string): boolean =>
  // Regular expression to match the specified account format: "U", "E", or "G" followed by 8 digits
  /^[UEG]\d{8}$/u.test(accountNumber);
