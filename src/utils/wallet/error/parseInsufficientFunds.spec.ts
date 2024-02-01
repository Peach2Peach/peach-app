import { insufficientFunds } from "../../../../tests/unit/data/errors";
import { parseInsufficientFunds } from "./parseInsufficientFunds";

describe("parseInsufficientFunds", () => {
  // https://github.com/bitcoindevkit/bdk/blob/8641847e6c037b7aa1a54791d36e56bfd91989f3/crates/bdk/src/error.rs#L123
  it("should parse the error for info", () => {
    expect(parseInsufficientFunds(insufficientFunds.message)).toEqual({
      needed: "78999997952",
      available: "1089000",
    });
  });

  it("should return unknown if the message is not parsable", () => {
    expect(parseInsufficientFunds("garbage")).toEqual({
      needed: "unknown",
      available: "unknown",
    });
  });
});
