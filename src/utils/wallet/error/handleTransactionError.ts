import { InsufficientFundsError } from "../types";
import { parseInsufficientFunds } from "./parseInsufficientFunds";

export const handleTransactionError = (
  transactionError: string,
): [Error, InsufficientFundsError | undefined] => {
  const notEnoughFunds = "InsufficientFunds";

  if (transactionError.includes(notEnoughFunds)) {
    const cause = parseInsufficientFunds(transactionError);

    return [new Error("INSUFFICIENT_FUNDS"), cause];
  }
  return [new Error(transactionError), undefined];
};
