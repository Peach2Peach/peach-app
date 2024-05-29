import { isUPIId } from "./isUPIId";

describe("isUPI", () => {
    it("should return true for a valid UPI ID", () => {
        expect(isUPIId("user@bank")).toBe(true);
        expect(isUPIId("123.user@bank123")).toBe(true);
        expect(isUPIId("user.name@bank")).toBe(true);
    });

    it("should return false for an invalid UPI ID", () => {
        expect(isUPIId("justuser")).toBe(false); // Missing '@' and bank code
        expect(isUPIId("user@")).toBe(false); // Missing bank code
        expect(isUPIId("@bank")).toBe(false); // Missing user ID
        expect(isUPIId("user@bank@something")).toBe(false); // Multiple '@' symbols
        expect(isUPIId("user name@bank")).toBe(false); // Space in user ID
    });

    it("should return false for an empty string", () => {
        expect(isUPIId("")).toBe(false);
    });
});
