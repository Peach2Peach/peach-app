import { ok } from "assert";
import { isProduction } from "./isProduction";

describe("isProduction", () => {
  it("checks whether app is running on android", () => {
    // note the mock in @env.js is setting DEV to true
    // if you know how to change the value within this test, feel free to improve this test
    ok(!isProduction());
  });
});
