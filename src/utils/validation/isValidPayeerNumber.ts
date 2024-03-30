export const isValidPayeerNumber = (accountNumber: string): boolean =>
  // Regular expression to match the Payeer account format: "P" followed by 9 digits
  /^P\d{10}$/u.test(accountNumber);
