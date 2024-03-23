import { Animated } from "react-native";
import tw from "../../../../styles/tailwind";
import { EIGHTY_PERCENT, getBackgroundColor } from "./getBackgroundColor";

describe("getBackgroundColor", () => {
  it("ensures interpolated value is within range", () => {
    const pan = new Animated.Value(EIGHTY_PERCENT);
    const bg = "#F56522";
    pan.interpolate = jest.fn().mockReturnValue(bg);

    expect(getBackgroundColor(pan)).toBe(bg);
    expect(pan.interpolate).toHaveBeenCalledWith({
      inputRange: [0, EIGHTY_PERCENT, 1],
      outputRange: [bg, bg, "#65A519"],
    });
  });
  it("accepts optional color", () => {
    const pan = new Animated.Value(EIGHTY_PERCENT);
    const bg = tw.color("liquid-primary");
    pan.interpolate = jest.fn().mockReturnValue(bg);

    expect(getBackgroundColor(pan, bg)).toBe(bg);
    expect(pan.interpolate).toHaveBeenCalledWith({
      inputRange: [0, EIGHTY_PERCENT, 1],
      outputRange: [bg, bg, "#65A519"],
    });
  });
});
