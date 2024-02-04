import { render, renderHook, waitFor } from "test-utils";
import { sellOffer } from "../../tests/unit/data/offerData";
import { Popup } from "../components/popup/Popup";
import { useCancelAndStartRefundPopup } from "./useCancelAndStartRefundPopup";

const mockRefundEscrow = jest.fn();
jest.mock("../hooks/useRefundEscrow", () => ({
  useRefundEscrow: () => mockRefundEscrow,
}));

jest.useFakeTimers();

describe("useCancelAndStartRefundPopup", () => {
  it("should return a function", () => {
    const { result } = renderHook(useCancelAndStartRefundPopup);
    expect(result.current).toBeInstanceOf(Function);
  });

  it("should show the loading popup and start refund", async () => {
    const { result } = renderHook(useCancelAndStartRefundPopup);
    result.current(sellOffer);
    const { queryByText } = render(<Popup />);
    await waitFor(() => {
      expect(queryByText("refunding escrow")).toBeTruthy();
      expect(mockRefundEscrow).toHaveBeenCalledWith(sellOffer, "psbt");
    });
  });
});
