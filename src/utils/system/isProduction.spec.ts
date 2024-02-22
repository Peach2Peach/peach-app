import { isProduction } from "./isProduction";

describe("isProduction", () => {
  it("checks whether app is running on android", () => {
    // note that .env.test is set to DEV=true
    // if you know how to change the value within this test, feel free to improve this test
    expect(isProduction()).toBe(false);
  });
});
