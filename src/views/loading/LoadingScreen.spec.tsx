import { LoadingScreen } from "./LoadingScreen";
import { createRenderer } from "react-test-renderer/shallow";

describe("LoadingScreen", () => {
  it("should render correctly", () => {
    const renderer = createRenderer();
    renderer.render(<LoadingScreen />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
