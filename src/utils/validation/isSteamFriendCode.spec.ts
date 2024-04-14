import { isSteamFriendCode } from "./isSteamFriendCode";

describe("isSteamFriendCode", () => {
  it("should return true for a valid Steam Friend Code", () => {
    expect(isSteamFriendCode("12345678901234567")).toBe(true);
    expect(isSteamFriendCode("12345678")).toBe(true);
    expect(isSteamFriendCode("12345678901237890")).toBe(true);
  });

  it("should return false for an invalid Steam Friend Code", () => {
    expect(isSteamFriendCode("123456")).toBe(false); // Too short
    expect(isSteamFriendCode("123456789012345678901")).toBe(false); // Too long
    expect(isSteamFriendCode("abcde123456789012")).toBe(false); // Contains letters
  });

  it("should return false for an empty string", () => {
    expect(isSteamFriendCode("")).toBe(false);
  });
});
