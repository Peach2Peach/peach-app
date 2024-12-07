import { enforcePhoneFormat } from "./enforcePhoneFormat";

describe("enforcePhoneFormat", () => {
  it("should return the same string if it starts with a + and only contains numbers and +", () => {
    expect(enforcePhoneFormat("+1234567890")).toBe("+1234567890");
  });

  it("should add a + to the beginning of the string if it does not start with a +", () => {
    expect(enforcePhoneFormat("1234567890")).toBe("+1234567890");
  });

  it("should remove all characters except numbers and + from the string", () => {
    expect(enforcePhoneFormat("+12 34 56 78 90")).toBe("+1234567890");
    expect(enforcePhoneFormat("+12a3-4567890")).toBe("+1234567890");
    expect(enforcePhoneFormat("49-123 4567890")).toBe("+491234567890");
  });

  it("should return an empty string if the input is an empty string", () => {
    expect(enforcePhoneFormat("")).toBe("+");
  });
});
