import { act, fireEvent, render, responseUtils, waitFor } from "test-utils";
import { GlobalPopup } from "../components/popup/GlobalPopup";
import { peachAPI } from "../utils/peachAPI";
import { useWalletState } from "../utils/wallet/walletStore";
import { CancelSellOffersPopup } from "./CancelSellOffersPopup";

jest.mock("../utils/offer/saveOffer");

const cancelOfferMock = jest.spyOn(peachAPI.private.offer, "cancelOffer");
jest.useFakeTimers();

describe("CancelSellOffersPopup", () => {
  const fundMultiple = {
    address: "address1",
    offerIds: ["1", "2", "3"],
  };
  beforeEach(() => {
    useWalletState
      .getState()
      .registerFundMultiple(fundMultiple.address, fundMultiple.offerIds);
  });

  it("should show cancel offer confirmation popup", async () => {
    const { getAllByText } = render(
      <CancelSellOffersPopup fundMultiple={fundMultiple} />,
    );
    fireEvent.press(getAllByText("cancel offer")[1]);
    const { queryByText } = render(<GlobalPopup />);
    await waitFor(() => {
      expect(queryByText("offer canceled!")).toBeTruthy();
    });

    expect(cancelOfferMock).toHaveBeenCalledWith({
      offerId: fundMultiple.offerIds[0],
    });
    expect(cancelOfferMock).toHaveBeenCalledWith({
      offerId: fundMultiple.offerIds[1],
    });
    expect(cancelOfferMock).toHaveBeenCalledWith({
      offerId: fundMultiple.offerIds[2],
    });
    expect(useWalletState.getState().fundMultipleMap).toEqual({});
  });
  it("not not cancel if no fundMultiple has been passed", async () => {
    const { getAllByText } = render(<CancelSellOffersPopup />);
    await act(async () => {
      await fireEvent.press(getAllByText("cancel offer")[1]);
    });

    expect(cancelOfferMock).not.toHaveBeenCalled();
  });
  it("should handle cancelation errors", async () => {
    cancelOfferMock.mockResolvedValueOnce({
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });
    cancelOfferMock.mockResolvedValueOnce(responseUtils);

    const { getAllByText } = render(
      <CancelSellOffersPopup fundMultiple={fundMultiple} />,
    );
    fireEvent.press(getAllByText("cancel offer")[1]);

    const { queryByText } = render(<GlobalPopup />);
    await waitFor(() => {
      expect(queryByText("offer canceled!")).not.toBeNull();
    });
    expect(useWalletState.getState().fundMultipleMap).toEqual({
      [fundMultiple.address]: ["1", "2"],
    });
  });
});
