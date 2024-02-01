import { Animated } from "react-native";
import { getTransform } from "./getTransform";

describe("getTransform", () => {
  it("ensures interpolated value is within range", () => {
    const panValue = 0.2;
    const pan = new Animated.Value(panValue);
    const width = 200;
    const translateX = 40;
    pan.interpolate = jest.fn().mockReturnValue(translateX);
    expect(getTransform(pan, width)).toEqual([{ translateX }]);

    expect(pan.interpolate).toHaveBeenCalledWith({
      inputRange: [0, 1],
      outputRange: [0, width],
      extrapolate: "clamp",
    });
  });
});
