import { createRenderer } from "react-test-renderer/shallow";
import { fireEvent, render } from "test-utils";
import { RadioButtons } from "./RadioButtons";

describe("RadioButtons", () => {
  const renderer = createRenderer();
  it("renders correctly", () => {
    renderer.render(
      <RadioButtons
        items={[
          {
            value: "EUR",
            display: "EUR",
          },
          {
            value: "GBP",
            display: "GBP",
          },
        ]}
        selectedValue={"EUR"}
        onButtonPress={jest.fn()}
      />,
    );
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });
  it("should call onChange when a radio button is pressed", () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <RadioButtons
        items={[
          {
            value: "EUR",
            display: "EUR",
          },
          {
            value: "GBP",
            display: "GBP",
          },
        ]}
        selectedValue={"EUR"}
        onButtonPress={onChange}
      />,
    );
    fireEvent.press(getByText("GBP"));
    expect(onChange).toHaveBeenCalledWith("GBP");
  });
  it("should not call onChange when a disabled radio button is pressed", () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <RadioButtons
        items={[
          {
            value: "EUR",
            display: "EUR",
          },
          {
            value: "GBP",
            display: "GBP",
            disabled: true,
          },
        ]}
        selectedValue={"EUR"}
        onButtonPress={onChange}
      />,
    );
    fireEvent.press(getByText("GBP"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
