import Clipboard from "@react-native-clipboard/clipboard";
import { fireEvent, render } from "test-utils";
import { CopyAble } from "./CopyAble";

jest.useFakeTimers();

describe("CopyAble", () => {
  const value = "value";

  it("should copy value to clipboard", () => {
    const { UNSAFE_getByProps } = render(<CopyAble {...{ value }} />);
    fireEvent.press(UNSAFE_getByProps({ id: "copy" }));
    expect(Clipboard.setString).toHaveBeenCalledWith(value);
  });
  it("should not copy if there's no value", () => {
    const { UNSAFE_getByProps } = render(<CopyAble />);
    fireEvent.press(UNSAFE_getByProps({ id: "copy" }));
    expect(Clipboard.setString).not.toHaveBeenCalled();
  });
  it("should forward reference", () => {
    let $copy = null;
    const ref = { current: null };
    render(<CopyAble ref={ref} />);
    $copy = ref.current;
    expect($copy).not.toBeNull();
  });
});
