import Clipboard from "@react-native-clipboard/clipboard";
import { TouchableOpacity } from "react-native";
import { act, create } from "react-test-renderer";
import { CopyAble, CopyRef } from "./CopyAble";

jest.useFakeTimers();

describe("CopyAble", () => {
  const value = "value";

  it("should copy value to clipboard", () => {
    const testInstance = create(<CopyAble {...{ value }} />).root;
    act(() => {
      testInstance.findByType(TouchableOpacity).props.onPress();
    });
    expect(Clipboard.setString).toHaveBeenCalledWith(value);
  });
  it("should not copy if there's no value", () => {
    const testInstance = create(<CopyAble />).root;
    act(() => {
      testInstance.findByType(TouchableOpacity).props.onPress();
    });

    expect(Clipboard.setString).not.toHaveBeenCalled();
  });
  it("should forward reference", () => {
    let $copy = null;
    create(<CopyAble ref={(r: CopyRef) => ($copy = r)} {...{ value }} />);
    expect($copy).toEqual({
      copy: expect.any(Function),
    });
  });
});
