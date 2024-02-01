import { toShortDateFormat } from "./toShortDateFormat";

describe("toShortDateFormat", () => {
  it("formats date to dd/mm/YYYY", () => {
    expect(toShortDateFormat(new Date(0))).toBe("01/01/1970");
  });
});
