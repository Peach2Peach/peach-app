import { Animated } from "react-native";
import { createRenderer } from "react-test-renderer/shallow";
import { toMatchDiffSnapshot } from "snapshot-diff";
import tw from "../../../../styles/tailwind";
import { SliderKnob } from "./SliderKnob";
expect.extend({ toMatchDiffSnapshot });

describe("SliderKnob", () => {
  const renderer = createRenderer();
  renderer.render(
    <SliderKnob pan={new Animated.Value(0)} iconId="checkCircle" />,
  );
  const base = renderer.getRenderOutput();
  it("renders correctly", () => {
    expect(base).toMatchSnapshot();
  });
  it("renders correctly with different color", () => {
    renderer.render(
      <SliderKnob
        pan={new Animated.Value(0)}
        iconId="checkCircle"
        color={tw.color("liquid-primary")}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchDiffSnapshot(base);
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
