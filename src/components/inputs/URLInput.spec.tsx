import Clipboard from "@react-native-clipboard/clipboard";
import { toMatchDiffSnapshot } from "snapshot-diff";
import { act, fireEvent, render, waitFor } from "test-utils";
import { ScanQR } from "../camera/ScanQR";
import { URLInput } from "./URLInput";
expect.extend({ toMatchDiffSnapshot });

jest.mock("../camera/ScanQR", () => ({
  ScanQR: "ScanQR",
}));
jest.useFakeTimers();

describe("URLInput", () => {
  const address = "blockstream.info";

  it("pastes address from clipboard", async () => {
    const onChangeMock = jest.fn();
    Clipboard.setString(address);
    const { UNSAFE_getByProps } = render(
      <URLInput value={""} onChangeText={onChangeMock} />,
    );
    const clipboardIcon = UNSAFE_getByProps({ id: "clipboard" });

    await act(() => {
      fireEvent.press(clipboardIcon);
    });
    expect(onChangeMock).toHaveBeenCalledWith(address);
  });
  it("pastes clipboard value if it is not a valid bitcoin address", async () => {
    const onChangeMock = jest.fn();
    Clipboard.setString(address);
    const { UNSAFE_getByProps } = render(
      <URLInput value={""} onChangeText={onChangeMock} />,
    );
    const clipboardIcon = UNSAFE_getByProps({ id: "clipboard" });

    await act(() => {
      fireEvent.press(clipboardIcon);
    });
    expect(onChangeMock).toHaveBeenCalledWith(address);
  });
  it("shows QR scanner when camera icon is pressed", async () => {
    const { UNSAFE_getByProps, toJSON } = render(<URLInput value={address} />);
    const cameraIcon = UNSAFE_getByProps({ id: "camera" });

    await waitFor(() => {
      fireEvent.press(cameraIcon);
    });
    expect(toJSON()).toMatchSnapshot();
  });
  it("closes QR scanner when onCancel event is triggered", async () => {
    const { UNSAFE_getByProps, toJSON, UNSAFE_getByType } = render(
      <URLInput value={address} />,
    );
    const cameraIcon = UNSAFE_getByProps({ id: "camera" });
    const { toJSON: toJSON2 } = render(<URLInput value={address} />);

    await waitFor(() => {
      fireEvent.press(cameraIcon);
    });
    fireEvent(UNSAFE_getByType(ScanQR), "onCancel");
    expect(toJSON()).toMatchDiffSnapshot(toJSON2());
  });
  it("sets address when QR scanner is successful", async () => {
    const onChangeMock = jest.fn();
    const { UNSAFE_getByProps, UNSAFE_getByType } = render(
      <URLInput value={address} onChangeText={onChangeMock} />,
    );
    const cameraIcon = UNSAFE_getByProps({ id: "camera" });

    await waitFor(() => {
      fireEvent.press(cameraIcon);
    });
    fireEvent(UNSAFE_getByType(ScanQR), "onRead", { data: address });
    expect(onChangeMock).toHaveBeenCalledWith(address);
  });
  it("sets address when QR scanner is successful and it is not a valid bitcoin address", async () => {
    const onChangeMock = jest.fn();
    const { UNSAFE_getByProps, UNSAFE_getByType } = render(
      <URLInput value={address} onChangeText={onChangeMock} />,
    );
    const cameraIcon = UNSAFE_getByProps({ id: "camera" });
    await waitFor(() => {
      fireEvent.press(cameraIcon);
    });
    fireEvent(UNSAFE_getByType(ScanQR), "onRead", { data: address });
    expect(onChangeMock).toHaveBeenCalledWith(address);
  });
});
