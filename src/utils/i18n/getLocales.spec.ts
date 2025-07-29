import i18n from "../i18n";

describe("getLocales", () => {
  it("returns all registered locales", () => {
    expect(i18n.getLocales()[0]).toBe("de");
    const EXPECTED_NUMBER_OF_LOCALES = 16;
    expect(i18n.getLocales()).toHaveLength(EXPECTED_NUMBER_OF_LOCALES);
    expect(
      i18n.getLocales().every((locale) => typeof locale === "string"),
    ).toBeTruthy();
  });
});
