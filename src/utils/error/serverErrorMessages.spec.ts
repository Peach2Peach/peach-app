import { getServerErrorMessageKey } from "./serverErrorMessages";

describe("getServerErrorMessageKey", () => {
  it("maps the sentences the server sends onto translatable keys", () => {
    expect(
      getServerErrorMessageKey("Please update the App to the latest version"),
    ).toBe("APP_UPDATE_REQUIRED");
    expect(getServerErrorMessageKey("You are not allowed to sell")).toBe(
      "SELLING_NOT_ALLOWED",
    );
    expect(
      getServerErrorMessageKey("The seller already has an ongoing trade"),
    ).toBe("SELLER_HAS_ONGOING_TRADE");
  });

  it("leaves error codes alone", () => {
    expect(getServerErrorMessageKey("UNAUTHORIZED")).toBeUndefined();
  });
});
