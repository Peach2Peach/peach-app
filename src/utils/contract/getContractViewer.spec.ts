import { getContractViewer } from "./getContractViewer";

describe("getContractViewer", () => {
  it('returns "seller" if account publicKey matches seller id', () => {
    expect(getContractViewer("02def", "02def")).toBe("seller");
  });

  it('returns "buyer" if account publicKey does not match seller id', () => {
    expect(getContractViewer("02def", "03dabc")).toBe("buyer");
  });
});
