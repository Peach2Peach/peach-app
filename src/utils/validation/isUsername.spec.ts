import { isUsername } from "./isUsername";

describe("isUsername", () => {
  test('Returns true for a valid username starting with "@" and containing only lowercase letters and numbers', () => {
    expect(isUsername("@username123")).toBe(true);
  });
  test("Returns true when username contains underscore", () => {
    expect(isUsername("@user_name123")).toBe(true);
  });
  test("Returns false when username ends with an underscore", () => {
    expect(isUsername("@username123_")).toBe(false);
  });
  test("Returns false when username starts with an underscore", () => {
    expect(isUsername("@_username123")).toBe(false);
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
