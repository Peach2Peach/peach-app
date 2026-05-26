// @ts-nocheck
import { buildBumpFeeTransaction } from "./buildBumpFeeTransaction";

describe("buildBumpFeeTransaction", () => {
  it("creates a bump fee transaction", () => {
    const builder = buildBumpFeeTransaction("txId", 10);
    expect(builder).toBeDefined();
  });
});
