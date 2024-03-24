import { toMatchDiffSnapshot } from "snapshot-diff";
import { fireEvent, render } from "test-utils";
import tw from "../../styles/tailwind";
import { PeachText } from "../text/PeachText";
import { RadioButtonItem } from "./RadioButtonItem";
expect.extend({ toMatchDiffSnapshot });

describe("RadioButtonItem", () => {
  const onPress = jest.fn();
  it("renders correctly with styles", () => {
    const props = {
      display: "EUR",
      onPress,
      isSelected: false,
      style: tw`p-4`,
      selectedStyle: tw`p-8`,
      radioIconColor: "blue",
    };
    const { toJSON, rerender } = render(<RadioButtonItem {...props} />);
    const base = toJSON();
    expect(base).toMatchSnapshot();
    rerender(<RadioButtonItem {...{ ...props, isSelected: true }} />);
    expect(toJSON()).toMatchDiffSnapshot(base);
  });
  it("renders correctly when selected", () => {
    const { toJSON } = render(
      <RadioButtonItem display="EUR" isSelected onPress={onPress} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("renders correctly when not selected", () => {
    const { toJSON } = render(
      <RadioButtonItem display="EUR" isSelected={false} onPress={onPress} />,
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
    const { getByText } = render(
      <RadioButtonItem display="EUR" isSelected={false} onPress={onPress} />,
    );
    fireEvent.press(getByText("EUR"));
    expect(onPress).toHaveBeenCalled();
  });
  it("does not call onPress when disabled", () => {
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
