import { createRenderer } from "react-test-renderer/shallow";
import { PremiumText } from "./PremiumText";

describe("PremiumText", () => {
  const renderer = createRenderer();
  it("should render correctly at market price", () => {
    renderer.render(<PremiumText premium={0} />);
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });

  it("should render correctly with premium", () => {
    renderer.render(<PremiumText premium={7} />);
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });

  it("should render correctly with discount", () => {
    renderer.render(<PremiumText premium={-7} />);
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });
});
