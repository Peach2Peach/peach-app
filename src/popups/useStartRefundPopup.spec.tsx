import { render, renderHook } from "test-utils";
import { sellOffer } from "../../tests/unit/data/offerData";
import { GlobalPopup } from "../components/popup/GlobalPopup";
import { useStartRefundPopup } from "./useStartRefundPopup";

const mockRefundEscrow = jest.fn();
jest.mock("../hooks/useRefundSellOffer", () => ({
  useRefundSellOffer: () => ({
    mutate: mockRefundEscrow,
  }),
}));

const psbt = "psbt";

const mockShowError = jest.fn();
jest.mock("../hooks/useShowErrorBanner", () => ({
  useShowErrorBanner: () => mockShowError,
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
    const { queryByText } = render(<GlobalPopup />);
    expect(queryByText("Refunding escrow")).toBeTruthy();
    expect(mockRefundEscrow).toHaveBeenCalledWith({ sellOffer, rawPSBT: psbt });
  });
});
