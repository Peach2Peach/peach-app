import { render, renderHook, waitFor } from "test-utils";
import { sellOffer } from "../../../../tests/unit/data/offerData";
import { replaceMock } from "../../../../tests/unit/helpers/NavigationWrapper";
import { Popup } from "../../../components/popup/Popup";
import { getDefaultFundingStatus } from "../../../utils/offer/constants";
import { useHandleFundingStatus } from "./useHandleFundingStatus";

const useTradeSummariesMock = jest.fn().mockReturnValue({
  offers: [],
  contracts: [],
  isLoading: false,
  refetch: jest.fn(),
});
jest.mock("../../../hooks/query/useTradeSummaries", () => ({
  useTradeSummaries: () => useTradeSummariesMock(),
}));
jest.useFakeTimers();

const searchWithNoMatches = {
  data: {
    pages: [
      {
        offerId: sellOffer.id,
        matches: [],
        totalMatches: 0,
        nextPage: 1,
      },
    ],
  },
};
const searchWithMatches = {
  data: {
    pages: [
      {
        offerId: sellOffer.id,
        matches: ["1", "2"],
        totalMatches: 2,
        nextPage: 1,
      },
    ],
  },
};
const fetchMatchesMock = jest.fn().mockResolvedValue(searchWithNoMatches);
const useOfferMatchesMock = jest.fn().mockReturnValue({
  refetch: fetchMatchesMock,
});
jest.mock("../../search/hooks/useOfferMatches", () => ({
  useOfferMatches: () => useOfferMatchesMock(),
}));

const startRefundPopupMock = jest.fn();
jest.mock("../../../popups/useStartRefundPopup", () => ({
  useStartRefundPopup: () => startRefundPopupMock,
}));

describe("useHandleFundingStatus", () => {
  const fundingStatusFunded: FundingStatus = {
    ...getDefaultFundingStatus(sellOffer.id),
    status: "FUNDED",
  };
  const fundedProps = {
    offerId: sellOffer.id,
    sellOffer,
    funding: fundingStatusFunded,
    userConfirmationRequired: false,
  };

  it("should do nothing if no sell offer is passed", () => {
    const initialProps = {
      offerId: sellOffer.id,
      sellOffer: undefined,
      funding: getDefaultFundingStatus(sellOffer.id),
      userConfirmationRequired: false,
    };
    renderHook(useHandleFundingStatus, { initialProps });
    expect(replaceMock).not.toHaveBeenCalled();
    expect(startRefundPopupMock).not.toHaveBeenCalled();
  });
  it("should handle funding status when it is CANCELED", () => {
    const funding: FundingStatus = {
      ...getDefaultFundingStatus(sellOffer.id),
      status: "CANCELED",
    };
    const initialProps = {
      offerId: sellOffer.id,
      sellOffer,
      funding,
      userConfirmationRequired: false,
    };
    renderHook(useHandleFundingStatus, { initialProps });
    expect(startRefundPopupMock).toHaveBeenCalledWith(sellOffer);
  });
  it("should show showWronglyFundedPopup when WRONG_FUNDING_AMOUNT", () => {
    const funding: FundingStatus = {
      ...getDefaultFundingStatus(sellOffer.id),
      status: "WRONG_FUNDING_AMOUNT",
    };
    const initialProps = {
      offerId: sellOffer.id,
      sellOffer,
      funding,
      userConfirmationRequired: false,
    };
    renderHook(useHandleFundingStatus, { initialProps });
    const { queryByText } = render(<Popup />);
    expect(queryByText("refund escrow")).toBeTruthy();
  });
  it("should navigate to wrongFundingAmount when user confirmation is required", () => {
    const funding: FundingStatus = {
      ...getDefaultFundingStatus(sellOffer.id),
      status: "MEMPOOL",
    };
    const initialProps = {
      offerId: sellOffer.id,
      sellOffer,
      funding,
      userConfirmationRequired: true,
    };
    renderHook(useHandleFundingStatus, { initialProps });
    expect(replaceMock).toHaveBeenCalledWith("wrongFundingAmount", {
      offerId: sellOffer.id,
    });
  });
  it("should go to search if funding status is FUNDED with matches already", async () => {
    fetchMatchesMock.mockResolvedValueOnce(searchWithMatches);

    renderHook(useHandleFundingStatus, { initialProps: fundedProps });
    await waitFor(() => expect(fetchMatchesMock).toHaveBeenCalled());
    expect(replaceMock).toHaveBeenCalledWith("search", {
      offerId: sellOffer.id,
    });
  });
});
