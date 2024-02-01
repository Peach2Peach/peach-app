import { createRenderer } from "react-test-renderer/shallow";
import { PasswordInput } from "./PasswordInput";

describe("PasswordInput", () => {
  it("renders correctly", () => {
    const renderer = createRenderer();
    renderer.render(<PasswordInput />);
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });
});
