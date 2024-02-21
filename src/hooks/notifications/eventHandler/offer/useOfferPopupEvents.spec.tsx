import { act, render, renderHook, responseUtils } from "test-utils";
import { sellOffer } from "../../../../../peach-api/src/testData/offers";
import { GlobalPopup } from "../../../../components/popup/GlobalPopup";
import { peachAPI } from "../../../../utils/peachAPI";
import { useOfferPopupEvents } from "./useOfferPopupEvents";

jest
  .spyOn(peachAPI.private.offer, "getOfferDetails")
  .mockResolvedValue({ result: sellOffer, ...responseUtils });

describe("useOfferPopupEvents", () => {
  const offerId = "123";

  it("should show confirm escrow popup on offer.fundingAmountDifferent", async () => {
    const { result } = renderHook(() => useOfferPopupEvents());
    const eventData = { offerId: sellOffer.id } as PNData;
    await act(() => {
      result.current["offer.fundingAmountDifferent"]?.(eventData);
    });
    const { queryByText } = render(<GlobalPopup />);
    expect(queryByText("different amounts")).toBeTruthy();
  });

  it("should show wrongly funded popup on offer.wrongFundingAmount", async () => {
    const { result } = renderHook(() => useOfferPopupEvents());

    const eventData = { offerId: sellOffer.id } as PNData;
    await act(() => {
      result.current["offer.wrongFundingAmount"]?.(eventData);
    });
    const { queryByText } = render(<GlobalPopup />);
    expect(queryByText("Incorrect funding")).toBeTruthy();
  });
  it("should show offer outside range popup on offer.outsideRange", () => {
    const { result } = renderHook(() => useOfferPopupEvents());

    const eventData = { offerId } as PNData;
    act(() => {
      result.current["offer.outsideRange"]?.(eventData);
    });
    const { queryByText } = render(<GlobalPopup />);
    expect(queryByText("bitcoin pumped!")).toBeTruthy();
  });
  it("should show buy offer expired popup on offer.buyOfferExpired", () => {
    const { result } = renderHook(() => useOfferPopupEvents());

    const eventData = { offerId: "1" } as PNData;
    act(() => {
      result.current["offer.buyOfferExpired"]?.(eventData, {
        bodyLocArgs: ["P-1", "30"],
      });
    });
    const { queryByText } = render(<GlobalPopup />);
    expect(queryByText("Buy offer removed")).toBeTruthy();
  });

  it("should not call popup functions when offerId is null", () => {
    const { result } = renderHook(() => useOfferPopupEvents());

    const eventData = {} as PNData;
    act(() => {
      result.current["offer.fundingAmountDifferent"]?.(eventData);
    });
    const { queryByText } = render(<GlobalPopup />);
    expect(queryByText("different amounts")).toBeFalsy();
    act(() => {
      result.current["offer.wrongFundingAmount"]?.(eventData);
    });
    expect(queryByText("Incorrect funding")).toBeFalsy();
    act(() => {
      result.current["offer.outsideRange"]?.(eventData);
    });
    expect(queryByText("bitcoin pumped!")).toBeFalsy();
  });
});
