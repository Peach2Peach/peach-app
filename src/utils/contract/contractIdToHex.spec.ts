import { contractIdToHex } from "./contractIdToHex";

describe("contractIdToHex", () => {
  test("should convert contract id to hex format", () => {
    expect(contractIdToHex("123-456")).toBe("PC‑7B‑1C8");
  });
});
