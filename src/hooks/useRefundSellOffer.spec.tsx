import {
  act,
  fireEvent,
  render,
  renderHook,
  responseUtils,
  waitFor,
} from "test-utils";
import { sellOffer } from "../../tests/unit/data/offerData";
import { navigateMock } from "../../tests/unit/helpers/NavigationWrapper";
import { Overlay } from "../Overlay";
import { GlobalPopup } from "../components/popup/GlobalPopup";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import { peachAPI } from "../utils/peachAPI";
import { useRefundSellOffer } from "./useRefundSellOffer";

const refundSellOfferMock = jest.spyOn(
  peachAPI.private.offer,
  "refundSellOffer",
);

jest.mock("../utils/bitcoin/checkRefundPSBT");
const checkRefundPSBTMock = jest.requireMock(
  "../utils/bitcoin/checkRefundPSBT",
).checkRefundPSBT;
jest.mock("../utils/bitcoin/signAndFinalizePSBT");
const signAndFinalizePSBTMock = jest.requireMock(
  "../utils/bitcoin/signAndFinalizePSBT",
).signAndFinalizePSBT;
jest.mock("../utils/bitcoin/showTransaction");
const showTransactionMock = jest.requireMock(
  "../utils/bitcoin/showTransaction",
).showTransaction;

jest.mock("../utils/offer/saveOffer");
const saveOfferMock = jest.requireMock("../utils/offer/saveOffer").saveOffer;

const mockRefetchTradeSummaries = jest.fn();
jest.mock("../hooks/query/useTradeSummaries", () => ({
  useTradeSummaries: () => ({
    refetch: mockRefetchTradeSummaries,
  }),
}));

jest.mock("../utils/wallet/getEscrowWalletForOffer");
const getEscrowWalletForOfferMock = jest.requireMock(
  "../utils/wallet/getEscrowWalletForOffer",
).getEscrowWalletForOffer;

const mockShowError = jest.fn();
jest.mock("../hooks/useShowErrorBanner", () => ({
  useShowErrorBanner: () => mockShowError,
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

  it("should refund the escrow when there is a cancel result", async () => {
    mockSuccess();
    useSettingsStore.setState({ refundToPeachWallet: false });
    const { result } = renderHook(useRefundSellOffer);
    act(() => {
      result.current.mutate({ sellOffer, rawPSBT: psbt });
    });
    await waitFor(() => {
      expect(checkRefundPSBTMock).toHaveBeenCalledWith("psbt", sellOffer);
      expect(signAndFinalizePSBTMock).toHaveBeenCalledWith(
        "checkedPsbt",
        "escrowWallet",
      );
    });
    const { queryByText } = render(<GlobalPopup />);
    expect(queryByText("escrow refunded")).toBeTruthy();
    expect(saveOfferMock).toHaveBeenCalledWith({
      ...sellOffer,
      tx: "hex",
      txId: "id",
      refunded: true,
    });
  });

  it("should handle psbt errors", async () => {
    checkRefundPSBTMock.mockReturnValueOnce({
      psbt: "something went wrong",
      err: "error",
    });
    const { result } = renderHook(useRefundSellOffer);
    act(() => {
      result.current.mutate({ sellOffer, rawPSBT: psbt });
    });
    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith("error");
    });
    const { queryByText } = render(<GlobalPopup />);
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
    const { result } = renderHook(useRefundSellOffer);
    act(() => {
      result.current.mutate({ sellOffer, rawPSBT: psbt });
    });
    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith("UNAUTHORIZED");
    });
    const { queryByText } = render(<GlobalPopup />);
    expect(queryByText("escrow refunded")).toBeFalsy();
  });

  it("should close popup and go to trades on close of success popup", async () => {
    mockSuccess();
    useSettingsStore.setState({ refundToPeachWallet: false });
    const { result } = renderHook(useRefundSellOffer);
    act(() => {
      result.current.mutate({ sellOffer, rawPSBT: psbt });
    });
    const { getByText, queryByText } = render(<GlobalPopup />);
    await waitFor(() => {
      expect(queryByText("close")).toBeTruthy();
    });
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

    const { result } = renderHook(useRefundSellOffer);
    act(() => {
      result.current.mutate({ sellOffer, rawPSBT: psbt });
    });
    const { getByText, queryByText } = render(<GlobalPopup />);
    await waitFor(() => {
      expect(queryByText("close")).toBeTruthy();
    });
    fireEvent.press(getByText("close"));
    expect(queryByText("escrow refunded")).toBeFalsy();
    const { getByText: getByOverlayText } = render(<Overlay />);
    expect(getByOverlayText("backup time!")).toBeTruthy();
  });

  it("should show the right success popup when peach wallet is active", async () => {
    mockSuccess();
    useSettingsStore.setState({ refundToPeachWallet: true });
    const { result } = renderHook(useRefundSellOffer);
    act(() => {
      result.current.mutate({ sellOffer, rawPSBT: psbt });
    });
    const { getByText } = render(<GlobalPopup />);
    await waitFor(() => {
      expect(
        getByText("The escrow has been refunded to your Peach wallet"),
      ).toBeTruthy();
    });
  });

  it("should go to peach wallet if peach wallet is active", async () => {
    mockSuccess();
    useSettingsStore.setState({ refundToPeachWallet: true });
    const { result } = renderHook(useRefundSellOffer);
    act(() => {
      result.current.mutate({ sellOffer, rawPSBT: psbt });
    });
    const { getByText, queryByText } = render(<GlobalPopup />);
    await waitFor(() => {
      expect(queryByText("go to wallet")).toBeTruthy();
    });
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

    const { result } = renderHook(useRefundSellOffer);
    act(() => {
      result.current.mutate({ sellOffer, rawPSBT: psbt });
    });
    const { getByText, queryByText } = render(<GlobalPopup />);
    await waitFor(() => {
      expect(queryByText("go to wallet")).toBeTruthy();
    });
    fireEvent.press(getByText("go to wallet"));
    const { getByText: getByOverlayText } = render(<Overlay />);
    expect(getByOverlayText("backup time!")).toBeTruthy();
  });

  it("should call showTransaction if peach wallet is not active", async () => {
    mockSuccess();
    useSettingsStore.setState({ refundToPeachWallet: false });
    const { result } = renderHook(useRefundSellOffer);
    act(() => {
      result.current.mutate({ sellOffer, rawPSBT: psbt });
    });
    const { getByText, queryByText } = render(<GlobalPopup />);
    await waitFor(() => {
      expect(queryByText("show tx")).toBeTruthy();
    });
    fireEvent.press(getByText("show tx"));
    expect(queryByText("escrow refunded")).toBeFalsy();
    expect(showTransactionMock).toHaveBeenCalledWith("id", "regtest");
  });
});
