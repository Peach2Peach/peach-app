import { txIsConfirmed } from "./txIsConfirmed";

describe("txIsConfirmed", () => {
  it("should return true for a ConfirmedTransaction", () => {
    const tx = {
      txid: "123",
      confirmationTime: {
        timestamp: 123,
        height: 1,
      },
      sent: 1,
      received: 1,
      fee: 1,
    };
    const result = txIsConfirmed(tx);
    expect(result).toEqual(true);
  });

  it("should return false for a PendingTransaction", () => {
    const tx = {
      txid: "123",
      sent: 1,
      received: 1,
      fee: 1,
    };
    const result = txIsConfirmed(tx);
    expect(result).toEqual(false);
  });
});
