import { enforceUsernameFormat } from "./enforceUsernameFormat";

describe("enforceUsernameFormat", () => {
  it("should enforce the username format correctly", () => {
    const testCases = [
      { username: "user1", expected: "@user1" },
      { username: "User1", expected: "@user1" },
      { username: "User1!", expected: "@user1" },
      { username: "", expected: "" },
    ];

    testCases.forEach(({ username, expected }) => {
      expect(enforceUsernameFormat(username)).toBe(expected);
    });
  });
});
