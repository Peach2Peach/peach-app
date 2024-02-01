import { isEmail } from "./isEmail";

describe("isEmail", () => {
  it("should return true for a valid email address", () => {
    expect(isEmail("test@example.com")).toBe(true);
  });

  it("should return false for an email address without a domain", () => {
    expect(isEmail("test@")).toBe(false);
  });

  it("should return false for an email address without a username", () => {
    expect(isEmail("@example.com")).toBe(false);
  });

  it("should return false for an email address with invalid characters", () => {
    expect(isEmail("test@example..com")).toBe(false);
  });

  it("should return false for an email address with spaces", () => {
    expect(isEmail("test example@example.com")).toBe(false);
  });

  it("should return false for an email address with a missing top-level domain", () => {
    expect(isEmail("test@example.")).toBe(false);
  });

  it("should return false for an email address with a top-level domain that is too short", () => {
    expect(isEmail("test@example.c")).toBe(false);
  });
});
