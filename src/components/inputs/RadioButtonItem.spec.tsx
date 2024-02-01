import { fireEvent, render } from "test-utils";
import { PeachText } from "../text/PeachText";
import { RadioButtonItem } from "./RadioButtonItem";

describe("RadioButtonItem", () => {
  it("renders correctly when selected", () => {
    const { toJSON } = render(
      <RadioButtonItem display="EUR" isSelected onPress={jest.fn()} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("renders correctly when not selected", () => {
    const { toJSON } = render(
      <RadioButtonItem display="EUR" isSelected={false} onPress={jest.fn()} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("renders correctly when disabled", () => {
    const { toJSON } = render(
      <RadioButtonItem
        display="EUR"
        isSelected={false}
        disabled
        onPress={jest.fn()}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("renders correctly when display is not a string", () => {
    const { toJSON } = render(
      <RadioButtonItem
        display={<PeachText>GBP</PeachText>}
        isSelected={false}
        onPress={jest.fn()}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <RadioButtonItem display="EUR" isSelected={false} onPress={onPress} />,
    );
    fireEvent.press(getByText("EUR"));
    expect(onPress).toHaveBeenCalled();
  });
  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <RadioButtonItem
        display="EUR"
        isSelected={false}
        disabled
        onPress={onPress}
      />,
    );
    fireEvent.press(getByText("EUR"));
    expect(onPress).not.toHaveBeenCalled();
  });
});
