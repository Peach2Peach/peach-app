import { offerIdFromHex } from "./offerIdFromHex";

describe("offerIdFromHex", () => {
  it("should convert hex to decimal", () => {
    expect(offerIdFromHex("P‑123")).toEqual("291");
    expect(offerIdFromHex("P‑1FF")).toEqual("511");
  });
});
