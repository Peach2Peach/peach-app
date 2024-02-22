import { createRenderer } from "react-test-renderer/shallow";
import { fireEvent, render } from "test-utils";
import { EmailInput } from "./EmailInput";
import { tolgee } from "../../tolgee";

describe("EmailInput", () => {
  const renderer = createRenderer();
  it("renders correctly", () => {
    renderer.render(<EmailInput />);
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });
  it("should enforce email format when onEndEditing is called", () => {
    const onChangeMock = jest.fn();
    const { getByPlaceholderText } = render(
      <EmailInput onChangeText={onChangeMock} />,
    );
    const input = getByPlaceholderText(tolgee.t("form.email.placeholder"));
    fireEvent(input, "onEndEditing", {
      nativeEvent: { text: "SaTOSHI@gmx.com" },
    });
    expect(onChangeMock).toHaveBeenLastCalledWith("satoshi@gmx.com");
  });
});
