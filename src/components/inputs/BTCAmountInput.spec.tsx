import { ViewStyle } from "react-native";
import { fireEvent, render } from "test-utils";
import tw from "../../styles/tailwind";
import { BTCAmountInput } from "./BTCAmountInput";

describe("BTCAmountInput", () => {
  const onChangeText = jest.fn();
  const props = {
    value: "0",
    onChangeText,
    size: "medium",
    textStyle: tw`absolute w-full py-0 opacity-0 grow h-38px input-text`,
    containerStyle: [
      tw`self-stretch justify-center px-2 py-3 overflow-hidden h-38px rounded-xl`,
      tw`border bg-primary-background-light border-black-65`,
    ] as ViewStyle[],
  } as const;
  it("renders correctly", () => {
    const { toJSON } = render(<BTCAmountInput {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("renders correctly for liquid chain", () => {
    const { toJSON } = render(<BTCAmountInput chain="liquid" {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("renders correctly for lightning", () => {
    const { toJSON } = render(<BTCAmountInput chain="lightning" {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("updates amount", () => {
    const { getByAccessibilityHint } = render(
      <BTCAmountInput chain="lightning" {...props} accessibilityHint="test" />,
    );
    fireEvent.changeText(getByAccessibilityHint("test"), "1523");

    expect(onChangeText).toHaveBeenCalledWith("1523");
  });
});
