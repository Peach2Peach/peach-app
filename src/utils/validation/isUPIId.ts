export const isUPIId = (upiId: string): boolean => /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+$/u.test(upiId);
