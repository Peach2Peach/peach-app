import ShallowRenderer from "react-test-renderer/shallow";
import { Trades } from "./Trades";

describe("Trades", () => {
  const renderer = ShallowRenderer.createRenderer();
  it("should render correctly", () => {
    renderer.render(<Trades trades={1} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
