import { groupIBAN } from "./groupIBAN";

describe("groupIBAN", () => {
  it("groups a canonical IBAN into blocks of four", () => {
    expect(groupIBAN("IE29AIBK93115212345678")).toBe(
      "IE29 AIBK 9311 5212 3456 78",
    );
    expect(groupIBAN("DE89370400440532013000")).toBe(
      "DE89 3704 0044 0532 0130 00",
    );
  });

  it("does not add a trailing space when the length is a multiple of four", () => {
    expect(groupIBAN("BE68539007547034")).toBe("BE68 5390 0754 7034");
  });

  it("leaves an IBAN containing whitespace untouched", () => {
    expect(groupIBAN("IE29 AIBK 9311 5212 3456 78")).toBe(
      "IE29 AIBK 9311 5212 3456 78",
    );
    expect(groupIBAN("IE29AIBK 93115212345678")).toBe(
      "IE29AIBK 93115212345678",
    );
  });

  it("leaves an IBAN containing dashes untouched", () => {
    expect(groupIBAN("IE29-AIBK-9311-5212-3456-78")).toBe(
      "IE29-AIBK-9311-5212-3456-78",
    );
  });

  it("leaves a lowercase IBAN untouched", () => {
    expect(groupIBAN("ie29aibk93115212345678")).toBe("ie29aibk93115212345678");
  });

  it("leaves an IBAN with invalid check digits untouched", () => {
    expect(groupIBAN("IE29AIBK93115212345679")).toBe("IE29AIBK93115212345679");
  });

  it("leaves something that is not an IBAN untouched", () => {
    expect(groupIBAN("NOTANIBAN")).toBe("NOTANIBAN");
    expect(groupIBAN("")).toBe("");
  });
});
