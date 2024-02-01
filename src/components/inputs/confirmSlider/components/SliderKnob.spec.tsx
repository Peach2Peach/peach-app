import { Animated } from "react-native";
import { createRenderer } from "react-test-renderer/shallow";
import { SliderKnob } from "./SliderKnob";

describe("SliderKnob", () => {
  const renderer = createRenderer();
  it("renders correctly", () => {
    renderer.render(
      <SliderKnob pan={new Animated.Value(0)} iconId="checkCircle" />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("renders when disabled", () => {
    renderer.render(
      <SliderKnob
        enabled={false}
        pan={new Animated.Value(0)}
        iconId="checkCircle"
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("renders when slided to the end", () => {
    renderer.render(
      <SliderKnob pan={new Animated.Value(1)} iconId="checkCircle" />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("renders when slided to 80%", () => {
    const EIGHTY_PERCENT = 0.8;
    renderer.render(
      <SliderKnob
        pan={new Animated.Value(EIGHTY_PERCENT)}
        iconId="checkCircle"
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
