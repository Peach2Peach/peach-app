import { fireEvent, render } from "test-utils";
import { RadioButtons } from "./RadioButtons";

describe("RadioButtons", () => {
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
