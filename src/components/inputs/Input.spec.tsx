import { createRenderer } from "react-test-renderer/shallow";
import { Input } from "./Input";

describe("Input", () => {
  const onChange = jest.fn();
  const onSubmit = jest.fn();
  const onEndEditing = jest.fn();
  const onBlur = jest.fn();
  const copy = jest.fn();
  it("renders correctly", () => {
    const renderer = createRenderer();
    renderer.render(<Input />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("renders correctly with placeholder", () => {
    const renderer = createRenderer();
    renderer.render(<Input placeholder="placeholder" />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("renders correctly with value", () => {
    const renderer = createRenderer();
    renderer.render(
      <Input value="value" {...{ onChange, onSubmit, onEndEditing, onBlur }} />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("renders correctly with icon", () => {
    const renderer = createRenderer();
    renderer.render(<Input value="value" icons={[["copy", copy]]} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
