import { transactionError } from "../../../../tests/unit/data/errors";
import { parseTransactionError } from "./parseTransactionError";

describe("parseTransactionError", () => {
  it("parses insufficient funds error", () => {
    const [error, cause] = transactionError;
    expect(parseTransactionError(error, cause)).toEqual([
      "78999997952",
      "1089000",
    ]);
  });
  it("parses fees too high error", () => {
    const error = new Error("FEES_TOO_HIGH");
    const cause = "cause";
    expect(parseTransactionError(error, cause)).toEqual([cause]);
  });
  it("returns empty array if no error could be parsed", () => {
    const error = new Error("OTHER");
    const cause = "cause";
    expect(parseTransactionError(error, cause)).toEqual([]);
  });
});
