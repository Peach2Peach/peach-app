import { getLocaleLanguage } from "./getLocaleLanguage";

describe("getLocaleLanguage", () => {
  it("should get language component of locale", () => {
    expect(getLocaleLanguage("de")).toBe("de");
    expect(getLocaleLanguage("de-DE")).toBe("de");
    expect(getLocaleLanguage("el-GR")).toBe("el");
    expect(getLocaleLanguage("el_GR")).toBe("el");
  });
});
