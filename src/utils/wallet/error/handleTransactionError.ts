import { InsufficientFundsError } from "../types";
import { parseInsufficientFunds } from "./parseInsufficientFunds";

export const handleTransactionError = (
  transactionError: string,
): [Error, InsufficientFundsError | undefined] => {
  const notEnoughFunds = "InsufficientFunds"; // ios error
  const notEnoughFunds2 = "Insufficient funds"; // android error

  if (
    transactionError.includes(notEnoughFunds) ||
    transactionError.startsWith(notEnoughFunds2)
  ) {
    const cause = parseInsufficientFunds(transactionError);

    return [new Error("INSUFFICIENT_FUNDS"), cause];
  }
  return [new Error(transactionError), undefined];
};
