export const isUPIId = (upiId: string) =>
  /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+$/u.test(upiId);
