// @ts-nocheck
import { buildTransaction } from "./buildTransaction";

describe("buildTransaction", () => {
  it("returns a TxBuilder with fee rate only", async () => {
    const result = await buildTransaction({ feeRate: 10 });
    expect(result).toBeDefined();
  });
});
