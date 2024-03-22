import { fireEvent, render } from "test-utils";
import { LightningInvoiceInput } from "./LightningInvoiceInput";

describe("LightningInvoiceInput", () => {
  const onChangeText = jest.fn();
  const props = {
    value: "",
    onChangeText,
  };
  it("renders correctly", () => {
    const { toJSON } = render(<LightningInvoiceInput {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("updates invoice", () => {
    const { getByPlaceholderText } = render(
      <LightningInvoiceInput {...props} />,
    );
    fireEvent.changeText(getByPlaceholderText("lightning invoice"), "invoice");

    expect(onChangeText).toHaveBeenCalledWith("invoice");
  });
});
