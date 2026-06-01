import { InsufficientFundsError } from "../types";
import { parseInsufficientFunds } from "./parseInsufficientFunds";

/**
 * bdk-rn 1.x (uniffi) throws a structured `CreateTxError` whose `.message` is
 * just the tag (e.g. "CreateTxError.CoinSelection") and whose useful payload
 * lives on `.inner`. When the wallet can't cover an amount it surfaces as
 * either:
 *   - `tag: "CoinSelection"` with `inner: { errorMessage: "Insufficient funds: N sat available of M sat needed" }`
 *   - `tag: "InsufficientFunds"` with `inner: { needed: bigint, available: bigint }`
 * Older bdk surfaced the amounts inside a plain message string instead.
 */
type StructuredTxError = {
  tag?: string;
  inner?: {
    needed?: bigint | number | string;
    available?: bigint | number | string;
    errorMessage?: string;
  };
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  // bdk-rn 1.x carries the human-readable text on `.inner.errorMessage`
  const innerMessage = (error as StructuredTxError)?.inner?.errorMessage;
  if (typeof innerMessage === "string") return innerMessage;
  if (error instanceof Error) return error.message;
  return String(error);
};

const getInsufficientFundsCause = (
  error: unknown,
  message: string,
): InsufficientFundsError => {
  const inner = (error as StructuredTxError)?.inner;
  // bdk-rn 1.x `InsufficientFunds` variant carries the amounts directly
  if (inner?.needed !== undefined && inner?.available !== undefined) {
    return {
      needed: String(inner.needed),
      available: String(inner.available),
    };
  }
  // otherwise fall back to parsing them out of the message string
  return parseInsufficientFunds(message);
};

export const handleTransactionError = (
  error: unknown,
): [Error, InsufficientFundsError | undefined] => {
  const tag = (error as StructuredTxError)?.tag;
  const transactionError = getErrorMessage(error);

  // eslint-disable-next-line no-console
  console.log("DEBUG handleTransactionError", {
    tag,
    message: error instanceof Error ? error.message : undefined,
    inner: (error as StructuredTxError)?.inner,
    errorMessage: (error as StructuredTxError)?.inner?.errorMessage,
    resolvedMessage: transactionError,
  });

  const notEnoughFunds = "InsufficientFunds"; // ios error
  const notEnoughFunds2 = "Insufficient funds"; // android error

  const isInsufficientFunds =
    // bdk-rn 1.x coin selection fails with these tags when funds are too low
    tag === "InsufficientFunds" ||
    tag === "CoinSelection" ||
    transactionError.includes(notEnoughFunds) ||
    transactionError.startsWith(notEnoughFunds2);

  if (isInsufficientFunds) {
    return [
      new Error("INSUFFICIENT_FUNDS"),
      getInsufficientFundsCause(error, transactionError),
    ];
  }
  return [new Error(transactionError), undefined];
};
