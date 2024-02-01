import { getLocalizedLink } from "./getLocalizedLink";

describe("getLocalizedLink", () => {
  it("should return the localized link to peach homepage", () => {
    expect(getLocalizedLink("privacy-policy", "en")).toBe(
      "https://peachbitcoin.com/privacy-policy",
    );
    expect(getLocalizedLink("privacy-policy", "de")).toBe(
      "https://peachbitcoin.com/de/privacy-policy",
    );
    expect(getLocalizedLink("privacy-policy", "el-GR")).toBe(
      "https://peachbitcoin.com/el/privacy-policy",
    );
  });
});
