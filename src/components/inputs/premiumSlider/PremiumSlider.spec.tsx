import { createRenderer } from "react-test-renderer/shallow";
import { PremiumSlider } from "./PremiumSlider";

describe("PremiumSlider", () => {
  const shallowRenderer = createRenderer();
  it("should render correctly", () => {
    shallowRenderer.render(
      <PremiumSlider premium={1.5} setPremium={jest.fn()} />,
    );
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
});
