import { isSteamFriendCode } from "./isSteamFriendCode";

describe("isSteamFriendCode", () => {
    it("should return true for a valid Steam Friend Code", () => {
        expect(isSteamFriendCode("12345678901234567")).toBe(true);
    });

    it("should return false for an invalid Steam Friend Code", () => {
        expect(isSteamFriendCode("123456")).toBe(false); // Too short
        expect(isSteamFriendCode("1234567890123456789")).toBe(false); // Too long
        expect(isSteamFriendCode("abcde123456789012")).toBe(false); // Contains letters
    });

    it("should return false for an empty string", () => {
        expect(isSteamFriendCode("")).toBe(false);
    });
});
