import ShallowRenderer from "react-test-renderer/shallow";
import { BulletPoint } from "./BulletPoint";

describe("BulletPoint", () => {
  const renderer = ShallowRenderer.createRenderer();
  it("renders correctly", () => {
    renderer.render(<BulletPoint text="text" />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
