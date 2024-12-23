import { Platform } from "react-native";
import { isAndroid } from "./isAndroid";

describe("isAndroid", () => {
  it("checks whether app is running on android", () => {
    jest.replaceProperty(Platform, "OS", "android");
    expect(isAndroid()).toBe(true);
    jest.replaceProperty(Platform, "OS", "ios");
    expect(isAndroid()).toBe(false);
  });
});
