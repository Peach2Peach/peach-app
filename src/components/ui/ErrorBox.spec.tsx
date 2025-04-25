import { ErrorBox } from "./ErrorBox";
import { createRenderer } from "react-test-renderer/shallow";

describe("ErrorBox", () => {
  it("should render ErrorBox component", () => {
    const shallowRenderer = createRenderer();
    shallowRenderer.render(<ErrorBox>some error text</ErrorBox>);
    const result = shallowRenderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });
});
