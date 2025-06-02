import { fireEvent, render } from "test-utils";
import { NumberInput } from "./NumberInput";

describe("NumberInput", () => {
  it("should enforce number format on change", () => {
    const onChangeMock = jest.fn();
    const { getByPlaceholderText } = render(
      <NumberInput
        decimals={2}
        placeholder="placeholder"
        onChangeText={onChangeMock}
      />,
    );
    const input = getByPlaceholderText("placeholder");
    fireEvent.changeText(input, "1,523");
    expect(onChangeMock).toHaveBeenLastCalledWith("1.52");
  });
});
