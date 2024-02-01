import { parseError } from "../../../utils/result/parseError";
import { InsufficientFundsError } from "../../../utils/wallet/types";

const isInsufficientFundsError = (
  cause: string | object,
): cause is InsufficientFundsError =>
  typeof cause === "object" && "needed" in cause;

export const parseTransactionError = (
  e: Error,
  cause: string | InsufficientFundsError,
): string[] => {
  const error = parseError(e);
  if (error === "FEES_TOO_HIGH") {
    if (typeof cause === "string") {
      return [cause];
    }
  }
  if (error === "INSUFFICIENT_FUNDS" && isInsufficientFundsError(cause)) {
    return [cause.needed, cause.available];
  }

  return [];
};
