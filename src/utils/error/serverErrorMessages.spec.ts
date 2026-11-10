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
      getServerErrorMessageKey(
        "You are not allowed to sell with these payment details. Please use payment details you have already used in a previous successful sale.",
      ),
    ).toBe("SELLING_ONLY_ALLOWED_WITH_PAST_SUCCESSFUL_SALES_PAYMENT_DETAILS");
    expect(getServerErrorMessageKey("You are not allowed to buy")).toBe(
      "BUYING_NOT_ALLOWED",
    );
    expect(
      getServerErrorMessageKey(
        "You are not allowed to buy with these payment details. Please use payment details you have already used in a previous successful purchase",
      ),
    ).toBe("BUYING_ONLY_ALLOWED_WITH_PAST_SUCCESSFUL_PURCHASES_PAYMENT_DETAILS");
    expect(
      getServerErrorMessageKey("The seller already has an ongoing trade"),
    ).toBe("SELLER_HAS_ONGOING_TRADE");
  });

  it("leaves error codes alone", () => {
    expect(getServerErrorMessageKey("UNAUTHORIZED")).toBeUndefined();
  });
});
