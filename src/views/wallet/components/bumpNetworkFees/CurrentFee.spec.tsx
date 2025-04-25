import ShallowRenderer from "react-test-renderer/shallow";
import { CurrentFee } from "./CurrentFee";

describe("CurrentFee", () => {
  const renderer = ShallowRenderer.createRenderer();
  it("renders correctly", () => {
    renderer.render(<CurrentFee fee={1} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
