import { render, renderHook } from "test-utils";
import { sellOffer } from "../../tests/unit/data/offerData";
import { Popup } from "../components/popup/Popup";
import { useStartRefundPopup } from "./useStartRefundPopup";

const refundEscrowMock = jest.fn();
jest.mock("../hooks/useRefundEscrow", () => ({
  useRefundEscrow: () => refundEscrowMock,
}));

const psbt = "psbt";

const showErrorMock = jest.fn();
jest.mock("../hooks/useShowErrorBanner", () => ({
  useShowErrorBanner: () => showErrorMock,
}));

jest.useFakeTimers();

describe("useStartRefundPopup", () => {
  it("should return a function", () => {
    const { result } = renderHook(useStartRefundPopup);
    expect(result.current).toBeInstanceOf(Function);
  });

  it("should show the loading popup and start refund", async () => {
    const { result } = renderHook(useStartRefundPopup);
    await result.current(sellOffer);
    const { queryByText } = render(<Popup />);
    expect(queryByText("refunding escrow")).toBeTruthy();
    expect(refundEscrowMock).toHaveBeenCalledWith(sellOffer, psbt);
  });
});
