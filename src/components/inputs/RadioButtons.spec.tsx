import { createRenderer } from "react-test-renderer/shallow";
import { fireEvent, render } from "test-utils";
import tw from "../../styles/tailwind";
import { RadioButtons } from "./RadioButtons";

describe("RadioButtons", () => {
  const renderer = createRenderer();
  const onChange = jest.fn();
  const items = [
    { value: "EUR", display: "EUR" },
    { value: "GBP", display: "GBP" },
  ];
  it("renders correctly", () => {
    renderer.render(
      <RadioButtons
        items={items}
        selectedValue={"EUR"}
        onButtonPress={onChange}
      />,
    );
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });
  it("renders correctly with styles", () => {
    renderer.render(
      <RadioButtons
        items={items}
        selectedValue={"EUR"}
        onButtonPress={onChange}
        radioButtonStyle={tw`p-4`}
        radioButtonSelectedStyle={tw`p-8`}
        radioIconColor="liquid"
      />,
    );
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });
  it("should call onChange when a radio button is pressed", () => {
    const { getByText } = render(
      <RadioButtons
        items={items}
        selectedValue={"EUR"}
        onButtonPress={onChange}
      />,
    );
    fireEvent.press(getByText("GBP"));
    expect(onChange).toHaveBeenCalledWith("GBP");
  });
  it("should not call onChange when a disabled radio button is pressed", () => {
    const { getByText } = render(
      <RadioButtons
        items={[
          { value: "EUR", display: "EUR" },
          { value: "GBP", display: "GBP", disabled: true },
        ]}
        selectedValue={"EUR"}
        onButtonPress={onChange}
      />,
    );
    fireEvent.press(getByText("GBP"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
