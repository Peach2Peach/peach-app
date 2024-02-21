import { Platform } from "react-native";
import { isIOS } from "./isIOS";

describe("isIOS", () => {
  it("checks whether app is running on android", () => {
    jest.replaceProperty(Platform, "OS", "ios");
    expect(isIOS()).toBe(true);
    jest.replaceProperty(Platform, "OS", "android");
    expect(isIOS()).toBe(false);
  });
});
