import { isUsername } from "./isUsername";

describe("isUsername", () => {
  test('Returns true for a valid username starting with "@" and containing only lowercase letters and numbers', () => {
    expect(isUsername("@username123")).toBe(true);
  });

  test('Returns false for a username that does not start with "@"', () => {
    expect(isUsername("username123")).toBe(false);
  });

  test("Returns false for a username that contains characters other than lowercase letters and numbers", () => {
    expect(isUsername("@username!23")).toBe(false);
  });

  test('Returns false for a username that is only "@"', () => {
    expect(isUsername("@")).toBe(false);
  });
  test("Returns false for a no username", () => {
    expect(isUsername("")).toBe(false);
  });
});
