import { createRenderer } from "react-test-renderer/shallow";
import { SliderLabel } from "./SliderLabel";

describe("SliderLabel", () => {
  const shallowRenderer = createRenderer();
  it("should render correctly", () => {
    shallowRenderer.render(<SliderLabel position={100}>text</SliderLabel>);
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
});
