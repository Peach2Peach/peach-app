import Clipboard from "@react-native-clipboard/clipboard";
import { createRenderer } from "react-test-renderer/shallow";
import { toMatchDiffSnapshot } from "snapshot-diff";
import { act, fireEvent, render, waitFor } from "test-utils";
import { ScanQR } from "../camera/ScanQR";
import { BitcoinAddressInput } from "./BitcoinAddressInput";
import { tolgee } from "../../tolgee";
expect.extend({ toMatchDiffSnapshot });

jest.mock("../camera/ScanQR", () => ({
  ScanQR: "ScanQR",
}));
jest.useFakeTimers();

describe("BitcoinAddressInput", () => {
  const fullAddress = "bc1qcj5yzmk8mjynz5vyxmre5zsgtntkwkcgn57r7z";
  it("renders correctly", () => {
    const renderer = createRenderer();
    renderer.render(<BitcoinAddressInput value={fullAddress} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("shows full address when focused", () => {
    const { getByPlaceholderText } = render(
      <BitcoinAddressInput value={fullAddress} />,
    );
    const input = getByPlaceholderText(
      tolgee.t("form.address.btc.placeholder"),
    );

    fireEvent(input, "focus");
    expect(input.props.value).toBe(fullAddress);
  });
  it("sets focused to false when blurred", () => {
    const { getByPlaceholderText, toJSON } = render(
      <BitcoinAddressInput value={fullAddress} />,
    );
    const input = getByPlaceholderText(
      tolgee.t("form.address.btc.placeholder"),
    );
    const { toJSON: toJSON2 } = render(
      <BitcoinAddressInput value={fullAddress} />,
    );

    fireEvent(input, "focus");
    fireEvent(input, "blur");
    expect(JSON.stringify(toJSON())).toBe(JSON.stringify(toJSON2()));
  });
  it("pastes address from clipboard", async () => {
    const onChangeMock = jest.fn();
    Clipboard.setString(fullAddress);
    const { UNSAFE_getByProps } = render(
      <BitcoinAddressInput value={""} onChangeText={onChangeMock} />,
    );
    const clipboardIcon = UNSAFE_getByProps({ id: "clipboard" });

    await act(() => {
      fireEvent.press(clipboardIcon);
    });
    expect(onChangeMock).toHaveBeenCalledWith(fullAddress);
  });
  it("pastes clipboard value if it is not a valid bitcoin address", async () => {
    const onChangeMock = jest.fn();
    Clipboard.setString("https://peachbitcoin.com");
    const { UNSAFE_getByProps } = render(
      <BitcoinAddressInput value={""} onChangeText={onChangeMock} />,
    );
    const clipboardIcon = UNSAFE_getByProps({ id: "clipboard" });

    await act(() => {
      fireEvent.press(clipboardIcon);
    });
    expect(onChangeMock).toHaveBeenCalledWith("https://peachbitcoin.com");
  });
  it("shows QR scanner when camera icon is pressed", async () => {
    const { UNSAFE_getByProps, toJSON } = render(
      <BitcoinAddressInput value={fullAddress} />,
    );
    const cameraIcon = UNSAFE_getByProps({ id: "camera" });

    await waitFor(() => {
      fireEvent.press(cameraIcon);
    });
    expect(toJSON()).toMatchSnapshot();
  });
  it("closes QR scanner when onCancel event is triggered", async () => {
    const { UNSAFE_getByProps, toJSON, UNSAFE_getByType } = render(
      <BitcoinAddressInput value={fullAddress} />,
    );
    const cameraIcon = UNSAFE_getByProps({ id: "camera" });
    const { toJSON: toJSON2 } = render(
      <BitcoinAddressInput value={fullAddress} />,
    );

    await waitFor(() => {
      fireEvent.press(cameraIcon);
    });
    fireEvent(UNSAFE_getByType(ScanQR), "onCancel");
    expect(toJSON()).toMatchDiffSnapshot(toJSON2());
  });
  it("sets address when QR scanner is successful", async () => {
    const onChangeMock = jest.fn();
    const { UNSAFE_getByProps, UNSAFE_getByType } = render(
      <BitcoinAddressInput value={fullAddress} onChangeText={onChangeMock} />,
    );
    const cameraIcon = UNSAFE_getByProps({ id: "camera" });

    await waitFor(() => {
      fireEvent.press(cameraIcon);
    });
    fireEvent(UNSAFE_getByType(ScanQR), "onRead", { data: fullAddress });
    expect(onChangeMock).toHaveBeenCalledWith(fullAddress);
  });
  it("sets address when QR scanner is successful and it is not a valid bitcoin address", async () => {
    const onChangeMock = jest.fn();
    const { UNSAFE_getByProps, UNSAFE_getByType } = render(
      <BitcoinAddressInput value={fullAddress} onChangeText={onChangeMock} />,
    );
    const cameraIcon = UNSAFE_getByProps({ id: "camera" });
    await waitFor(() => {
      fireEvent.press(cameraIcon);
    });
    fireEvent(UNSAFE_getByType(ScanQR), "onRead", {
      data: "https://peachbitcoin.com",
    });
    expect(onChangeMock).toHaveBeenCalledWith("https://peachbitcoin.com");
  });
});
