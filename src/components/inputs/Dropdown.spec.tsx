import { toMatchDiffSnapshot } from "snapshot-diff";
import { fireEvent, render } from "test-utils";
import { Dropdown } from "./Dropdown";
expect.extend({ toMatchDiffSnapshot });

describe("Dropdown", () => {
  const onChange = jest.fn();
  const value = "a";
  const options = ["a", "b", "c"];

  const base = render(<Dropdown {...{ value, options, onChange }} />).toJSON();
  it("renders correctly", () => {
    expect(base).toMatchSnapshot();
  });
  it("opens on press", () => {
    const { toJSON, getByText } = render(
      <Dropdown {...{ value, options, onChange }} />,
    );
    fireEvent.press(getByText("a"));
    expect(toJSON()).toMatchDiffSnapshot(base);
  });
  it("selects value", () => {
    const { getByText } = render(
      <Dropdown {...{ value, options, onChange }} />,
    );
    fireEvent.press(getByText("a"));
    fireEvent.press(getByText("b"));
    expect(onChange).toHaveBeenCalledWith("b");
  });
});
