import { offerIdToHex } from "./offerIdToHex";

describe("offerIdToHex", () => {
  test("should convert offer id to hex format", () => {
    expect(offerIdToHex("123")).toBe("P‑7B");
  });
});
