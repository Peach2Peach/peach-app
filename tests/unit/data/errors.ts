export const insufficientFunds = new Error(
  'InsufficientFunds(message: "Insufficient funds: 1089000 sat available of 78999997952 sat needed")',
);
export const transactionError = [
  new Error("INSUFFICIENT_FUNDS"),
  {
    needed: "78999997952",
    available: "1089000",
  },
] as const;
