import { fireEvent, render } from "test-utils";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  it("calls onPress handler", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Toggle enabled={true} onPress={onPress}>
        label
      </Toggle>,
    );
    fireEvent.press(getByText("label"));
    expect(onPress).toHaveBeenCalled();
  });
  it("does not call onPress handler when disabled", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Toggle enabled={true} disabled onPress={onPress}>
        label
      </Toggle>,
    );
    fireEvent.press(getByText("label"));
    expect(onPress).not.toHaveBeenCalled();
  });
});
