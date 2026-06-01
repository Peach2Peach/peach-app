import { handleTransactionError } from "./handleTransactionError";

describe("handleTransactionError", () => {
  // https://github.com/bitcoindevkit/bdk/blob/8641847e6c037b7aa1a54791d36e56bfd91989f3/crates/bdk/src/error.rs#L123
  const insufficientFundsError =
    'InsufficientFunds(message: "Insufficient funds: 1089000 sat available of 78999997952 sat needed")';
  it("should parse the error for insufficient funds", () => {
    expect(handleTransactionError(insufficientFundsError)).toEqual([
      new Error("INSUFFICIENT_FUNDS"),
      { available: "1089000", needed: "78999997952" },
    ]);
  });
  it("should parse the bdk-rn 1.x CoinSelection error as insufficient funds", () => {
    // bdk-rn 1.x coin selection fails with a CreateTxError.CoinSelection whose
    // amounts live in the human-readable string on `.inner.errorMessage`
    const coinSelectionError = Object.assign(
      new Error("CreateTxError.CoinSelection"),
      {
        tag: "CoinSelection",
        inner: {
          errorMessage:
            "Insufficient funds: 1089000 sat available of 78999997952 sat needed",
        },
      },
    );
    expect(handleTransactionError(coinSelectionError)).toEqual([
      new Error("INSUFFICIENT_FUNDS"),
      { available: "1089000", needed: "78999997952" },
    ]);
  });
  it("should parse the structured bdk-rn 1.x insufficient funds error", () => {
    // bdk-rn 1.x (uniffi) throws a CreateTxError whose message is just the tag
    // and whose amounts live on `.inner`
    const structuredError = Object.assign(
      new Error("CreateTxError.InsufficientFunds"),
      {
        tag: "InsufficientFunds",
        inner: { needed: BigInt("78999997952"), available: BigInt("1089000") },
      },
    );
    expect(handleTransactionError(structuredError)).toEqual([
      new Error("INSUFFICIENT_FUNDS"),
      { available: "1089000", needed: "78999997952" },
    ]);
  });
  it("should return error message if not known", () => {
    const error = "some other error";
    expect(handleTransactionError(error)).toEqual([new Error(error)]);
  });
});
