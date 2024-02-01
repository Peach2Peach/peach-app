import { View } from "react-native";
import { RNCamera } from "react-native-camera";
import { toMatchDiffSnapshot } from "snapshot-diff";
import { fireEvent, render } from "test-utils";
import { QRCodeScanner } from "./QRCodeScanner";
expect.extend({ toMatchDiffSnapshot });

jest.useFakeTimers();
jest.mock("react-native-camera", () => ({
  RNCamera: "RNCamera",
}));

describe("QRCodeScanner", () => {
  const defaultScanner = (
    <QRCodeScanner onRead={jest.fn()} customMarker={<View />} />
  );
  it("renders correctly", () => {
    const { toJSON } = render(defaultScanner);
    expect(toJSON()).toMatchSnapshot();
  });
  it("fades in", () => {
    const { toJSON } = render(defaultScanner);
    jest.runAllTimers();
    expect(render(defaultScanner).toJSON()).toMatchDiffSnapshot(toJSON());
  });
  it("calls onRead when a QR code is read", () => {
    const onRead = jest.fn();
    const { UNSAFE_getByType } = render(
      <QRCodeScanner onRead={onRead} customMarker={<View />} />,
    );
    fireEvent(UNSAFE_getByType(RNCamera), "onBarCodeRead", { data: "test" });
    expect(onRead).toHaveBeenCalledWith({ data: "test" });
  });
});
