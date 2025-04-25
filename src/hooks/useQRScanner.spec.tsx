import permissions, { RESULTS } from "react-native-permissions";
import { act, render, renderHook, waitFor } from "test-utils";
import { GlobalPopup } from "../components/popup/GlobalPopup";
import { useQRScanner } from "./useQRScanner";

jest.mock("../utils/system/isIOS", () => ({
  isIOS: jest.fn(() => true),
}));
const isIOSMock = jest.requireMock("../utils/system/isIOS").isIOS;
jest.useFakeTimers();

describe("useQRScanner", () => {
  const requestSpy = jest.spyOn(permissions, "request");
  const initialProps = {
    onSuccess: jest.fn(),
  };
  it("should return defaults", () => {
    const { result } = renderHook(useQRScanner, { initialProps });
    expect(result.current).toEqual({
      showQRScanner: false,
      showQR: expect.any(Function),
      closeQR: expect.any(Function),
      onRead: expect.any(Function),
    });
  });
  it("requests permissions on iOS", async () => {
    const { result } = renderHook(useQRScanner, { initialProps });
    await act(async () => {
      await result.current.showQR();
    });
    expect(permissions.request).toHaveBeenCalledWith("ios.permission.CAMERA");
  });
  it("does not request permissions on android and shows qr scanner", () => {
    isIOSMock.mockReturnValueOnce(false);
    const { result } = renderHook(useQRScanner, { initialProps });
    act(() => result.current.showQR());
    expect(permissions.request).not.toHaveBeenCalled();
    expect(result.current.showQRScanner).toBeTruthy();
  });
  it("doesn't show the QR scanner when permissions haven't been granted", () => {
    requestSpy.mockImplementationOnce(() => Promise.resolve(RESULTS.DENIED));
    const { result } = renderHook(useQRScanner, { initialProps });
    act(() => result.current.showQR());
    expect(result.current.showQRScanner).toBeFalsy();
  });
  it("opens the warning popup when permissions have been denied", async () => {
    requestSpy.mockImplementationOnce(() => Promise.resolve(RESULTS.DENIED));
    const { result } = renderHook(useQRScanner, { initialProps });
    const { queryByText } = render(<GlobalPopup />);
    await act(async () => {
      await result.current.showQR();
    });
    expect(result.current.showQRScanner).toBeFalsy();
    expect(queryByText("Missing permissions")).toBeTruthy();
  });
  it("should show and closeQR", async () => {
    requestSpy.mockImplementationOnce(() => Promise.resolve(RESULTS.GRANTED));
    const { result } = renderHook(useQRScanner, { initialProps });
    act(() => result.current.showQR());

    await waitFor(() => expect(result.current.showQRScanner).toBeTruthy());
    act(() => result.current.closeQR());
    expect(result.current.showQRScanner).toBeFalsy();
  });
});
