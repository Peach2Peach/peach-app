import { ConfirmSliderLabel } from "./ConfirmSliderLabel";
import { createRenderer } from "react-test-renderer/shallow";
import { Animated } from "react-native";

describe("ConfirmSliderLabel", () => {
  const renderer = createRenderer();
  it("renders correctly", () => {
    renderer.render(
      <ConfirmSliderLabel width={200} opacity={new Animated.Value(1)}>
        label
      </ConfirmSliderLabel>,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
