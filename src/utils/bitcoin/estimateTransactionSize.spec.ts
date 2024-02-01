import { estimateTransactionSize } from "./estimateTransactionSize";

describe("estimateTransactionSize", () => {
  it("returns an estimated transaction size based on input numbers and outputs", () => {
    const inputs1 = 1;
    const outputs1 = 3;
    const expectedSize1 = 216.5;
    expect(estimateTransactionSize(inputs1, outputs1)).toEqual(expectedSize1);
    const inputs2 = 2;
    const outputs2 = 3;
    const expectedSize2 = 284.5;
    expect(estimateTransactionSize(inputs2, outputs2)).toEqual(expectedSize2);
    const inputs3 = 1;
    const outputs3 = 4;
    const expectedSize3 = 262.5;
    expect(estimateTransactionSize(inputs3, outputs3)).toEqual(expectedSize3);
  });
});
