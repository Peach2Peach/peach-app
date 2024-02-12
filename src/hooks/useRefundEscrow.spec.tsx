import { act, fireEvent, render, renderHook, responseUtils } from "test-utils";
import { sellOffer } from "../../tests/unit/data/offerData";
import { navigateMock } from "../../tests/unit/helpers/NavigationWrapper";
import { Overlay } from "../Overlay";
import { Popup } from "../components/popup/Popup";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import { peachAPI } from "../utils/peachAPI";
import { useRefundEscrow } from "./useRefundEscrow";

const refundSellOfferMock = jest.spyOn(
  peachAPI.private.offer,
  "refundSellOffer",
);

const checkRefundPSBTMock = jest.fn();
jest.mock("../utils/bitcoin/checkRefundPSBT", () => ({
  checkRefundPSBT: (...args: unknown[]) => checkRefundPSBTMock(...args),
}));
const signAndFinalizePSBTMock = jest.fn();
jest.mock("../utils/bitcoin/signAndFinalizePSBT", () => ({
  signAndFinalizePSBT: (...args: unknown[]) => signAndFinalizePSBTMock(...args),
}));
const showTransactionMock = jest.fn();
jest.mock("../utils/blockchain/showTransaction", () => ({
  showTransaction: (...args: unknown[]) => showTransactionMock(...args),
}));

const saveOfferMock = jest.fn();
jest.mock("../utils/offer/saveOffer", () => ({
  saveOffer: (...args: unknown[]) => saveOfferMock(...args),
}));

const refetchTradeSummariesMock = jest.fn();
jest.mock("../hooks/query/useTradeSummaries", () => ({
  useTradeSummaries: jest.fn(() => ({
    refetch: refetchTradeSummariesMock,
  })),
}));

const getEscrowWalletForOfferMock = jest.fn();
jest.mock("../utils/wallet/getEscrowWalletForOffer", () => ({
  getEscrowWalletForOffer: (...args: unknown[]) =>
    getEscrowWalletForOfferMock(...args),
}));

const showErrorMock = jest.fn();
jest.mock("../hooks/useShowErrorBanner", () => ({
  useShowErrorBanner: () => showErrorMock,
}));

jest.useFakeTimers();

describe("useRefundEscrow", () => {
  const psbt = "psbt";

  const mockSuccess = () => {
    checkRefundPSBTMock.mockReturnValueOnce({ psbt: "checkedPsbt", err: null });
    signAndFinalizePSBTMock.mockReturnValueOnce({
      extractTransaction: () => ({ toHex: () => "hex", getId: () => "id" }),
    });
    refundSellOfferMock.mockResolvedValueOnce(responseUtils);
    getEscrowWalletForOfferMock.mockReturnValueOnce("escrowWallet");
  };
  beforeEach(() => {
    useSettingsStore.getState().setShowBackupReminder(false);
  });
  it("should return a function", () => {
    const { result } = renderHook(useRefundEscrow);
    expect(result.current).toBeInstanceOf(Function);
  });

  it("should refund the escrow when there is a cancel result", async () => {
    mockSuccess();
    useSettingsStore.setState({ refundToPeachWallet: false });
    const { result } = renderHook(useRefundEscrow);
    await act(async () => {
      await result.current(sellOffer, psbt);
    });
    expect(checkRefundPSBTMock).toHaveBeenCalledWith("psbt", sellOffer);
    expect(signAndFinalizePSBTMock).toHaveBeenCalledWith(
      "checkedPsbt",
      "escrowWallet",
    );
    const { queryByText } = render(<Popup />);
    expect(queryByText("escrow refunded")).toBeTruthy();
    expect(saveOfferMock).toHaveBeenCalledWith({
      ...sellOffer,
      tx: "hex",
      txId: "id",
      refunded: true,
    });
    expect(refetchTradeSummariesMock).toHaveBeenCalled();
  });

  it("should handle psbt errors", async () => {
    checkRefundPSBTMock.mockReturnValueOnce({
      psbt: "something went wrong",
      err: "error",
    });
    const { result } = renderHook(useRefundEscrow);
    await act(async () => {
      await result.current(sellOffer, psbt);
    });
    expect(showErrorMock).toHaveBeenCalledWith("error");
    const { queryByText } = render(<Popup />);
    expect(queryByText("escrow refunded")).toBeFalsy();
  });

  it("should handle refund errors", async () => {
    checkRefundPSBTMock.mockReturnValueOnce({ psbt: "checkedPsbt", err: null });
    signAndFinalizePSBTMock.mockReturnValueOnce({
      extractTransaction: () => ({ toHex: () => "hex", getId: () => "id" }),
    });
    refundSellOfferMock.mockResolvedValueOnce({
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });
    getEscrowWalletForOfferMock.mockReturnValueOnce("escrowWallet");
    useSettingsStore.setState({ refundToPeachWallet: false });
    const { result } = renderHook(useRefundEscrow);
    await act(async () => {
      await result.current(sellOffer, psbt);
    });
    expect(showErrorMock).toHaveBeenCalledWith("UNAUTHORIZED");
    const { queryByText } = render(<Popup />);
    expect(queryByText("escrow refunded")).toBeFalsy();
  });

  it("should close popup and go to trades on close of success popup", async () => {
    mockSuccess();
    useSettingsStore.setState({ refundToPeachWallet: false });
    const { result } = renderHook(useRefundEscrow);
    await act(async () => {
      await result.current(sellOffer, psbt);
    });
    const { getByText, queryByText } = render(<Popup />);
    fireEvent.press(getByText("close"));
    expect(queryByText("escrow refunded")).toBeFalsy();
    expect(navigateMock).toHaveBeenCalledWith("homeScreen", {
      screen: "yourTrades",
      params: { tab: "yourTrades.history" },
    });
  });
  it("should close popup and go to backup time on close of success popup if backup is needed", async () => {
    mockSuccess();
    useSettingsStore.setState({ refundToPeachWallet: true });
    useSettingsStore.getState().setShowBackupReminder(true);

    const { result } = renderHook(useRefundEscrow);
    await act(async () => {
      await result.current(sellOffer, psbt);
    });
    const { getByText, queryByText } = render(<Popup />);
    fireEvent.press(getByText("close"));
    expect(queryByText("escrow refunded")).toBeFalsy();
    const { getByText: getByOverlayText } = render(<Overlay />);
    expect(getByOverlayText("backup time!")).toBeTruthy();
  });

  it("should show the right success popup when peach wallet is active", async () => {
    mockSuccess();
    useSettingsStore.setState({ refundToPeachWallet: true });
    const { result } = renderHook(useRefundEscrow);
    await act(async () => {
      await result.current(sellOffer, psbt);
    });
    const { getByText } = render(<Popup />);
    expect(
      getByText("The escrow has been refunded to your Peach wallet"),
    ).toBeTruthy();
  });

  it("should go to peach wallet if peach wallet is active", async () => {
    mockSuccess();
    useSettingsStore.setState({ refundToPeachWallet: true });
    const { result } = renderHook(useRefundEscrow);
    await act(async () => {
      await result.current(sellOffer, psbt);
    });
    const { getByText, queryByText } = render(<Popup />);
    fireEvent.press(getByText("go to wallet"));
    expect(queryByText("escrow refunded")).toBeFalsy();
    expect(navigateMock).toHaveBeenCalledWith("transactionDetails", {
      txId: "id",
    });
  });
  it("should go to backup time if backup is needed when going to wallet", async () => {
    mockSuccess();
    useSettingsStore.setState({ refundToPeachWallet: true });
    useSettingsStore.getState().setShowBackupReminder(true);

    const { result } = renderHook(useRefundEscrow);
    await act(async () => {
      await result.current(sellOffer, psbt);
    });
    const { getByText } = render(<Popup />);
    fireEvent.press(getByText("go to wallet"));
    const { getByText: getByOverlayText } = render(<Overlay />);
    expect(getByOverlayText("backup time!")).toBeTruthy();
  });

  it("should call showTransaction if peach wallet is not active", async () => {
    mockSuccess();
    useSettingsStore.setState({ refundToPeachWallet: false });
    const { result } = renderHook(useRefundEscrow);
    await act(async () => {
      await result.current(sellOffer, psbt);
    });
    const { getByText, queryByText } = render(<Popup />);
    fireEvent.press(getByText("show tx"));
    expect(queryByText("escrow refunded")).toBeFalsy();
    expect(showTransactionMock).toHaveBeenCalledWith("id", "bitcoin");
  });
});
