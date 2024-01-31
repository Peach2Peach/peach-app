import { contractIdFromHex } from "./contractIdFromHex";

describe("contractIdFromHex", () => {
  it("should convert hex to decimal", () => {
    expect(contractIdFromHex("PC‑123‑456")).toEqual("291-1110");
    expect(contractIdFromHex("PC‑1F4‑1EC")).toEqual("500-492");
  });
});
