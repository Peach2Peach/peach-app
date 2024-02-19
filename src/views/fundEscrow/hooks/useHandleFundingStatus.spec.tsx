import { render, renderHook, waitFor } from "test-utils";
import { sellOffer } from "../../../../tests/unit/data/offerData";
import { replaceMock } from "../../../../tests/unit/helpers/NavigationWrapper";
import { GlobalPopup } from "../../../components/popup/GlobalPopup";
import { offerKeys } from "../../../hooks/query/useOfferDetail";
import { queryClient } from "../../../queryClient";
import { defaultFundingStatus } from "../../../utils/offer/constants";
import { useHandleFundingStatus } from "./useHandleFundingStatus";

jest.mock("../../../hooks/query/useTradeSummaries", () => ({
  useTradeSummaries: jest.fn().mockReturnValue({
    offers: [],
    contracts: [],
    isLoading: false,
    refetch: jest.fn(),
  }),
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
const mockFetchMatches = jest.fn().mockResolvedValue(searchWithNoMatches);
jest.mock("../../search/hooks/useOfferMatches", () => ({
  useOfferMatches: () => ({
    refetch: mockFetchMatches,
  }),
}));

const mockStartRefundPopup = jest.fn();
jest.mock("../../../popups/useStartRefundPopup", () => ({
  useStartRefundPopup: () => mockStartRefundPopup,
}));

describe("useHandleFundingStatus", () => {
  const fundingStatusFunded: FundingStatus = {
    ...defaultFundingStatus,
    status: "FUNDED",
  };
  const fundedProps = {
    offerId: sellOffer.id,
    sellOffer,
    fundingStatus: fundingStatusFunded,
    userConfirmationRequired: false,
  };

  afterEach(() => {
    queryClient.clear();
  });

  it("should do nothing if no sell offer is passed", () => {
    const initialProps = {
      offerId: sellOffer.id,
      sellOffer: undefined,
      fundingStatus: defaultFundingStatus,
      userConfirmationRequired: false,
    };
    renderHook(useHandleFundingStatus, { initialProps });
    expect(replaceMock).not.toHaveBeenCalled();
    expect(mockStartRefundPopup).not.toHaveBeenCalled();
    expect(
      queryClient.getQueryData(offerKeys.detail(sellOffer.id)),
    ).toBeUndefined();
  });
  it("should save offer when funding status updates", () => {
    const fundingStatus = defaultFundingStatus;
    const initialProps = {
      offerId: sellOffer.id,
      sellOffer,
      fundingStatus,
      userConfirmationRequired: false,
    };
    renderHook(useHandleFundingStatus, { initialProps });
    expect(queryClient.getQueryData(offerKeys.detail(sellOffer.id))).toEqual({
      ...sellOffer,
      funding: fundingStatus,
    });
  });
  it("should handle funding status when it is CANCELED", () => {
    const fundingStatus: FundingStatus = {
      ...defaultFundingStatus,
      status: "CANCELED",
    };
    const initialProps = {
      offerId: sellOffer.id,
      sellOffer,
      fundingStatus,
      userConfirmationRequired: false,
    };
    renderHook(useHandleFundingStatus, { initialProps });
    expect(mockStartRefundPopup).toHaveBeenCalledWith(sellOffer);
  });
  it("should show showWronglyFundedPopup when WRONG_FUNDING_AMOUNT", () => {
    const fundingStatus: FundingStatus = {
      ...defaultFundingStatus,
      status: "WRONG_FUNDING_AMOUNT",
    };
    const initialProps = {
      offerId: sellOffer.id,
      sellOffer,
      fundingStatus,
      userConfirmationRequired: false,
    };
    renderHook(useHandleFundingStatus, { initialProps });
    const { queryByText } = render(<GlobalPopup />);
    expect(queryByText("refund escrow")).toBeTruthy();
  });
  it("should navigate to wrongFundingAmount when user confirmation is required", () => {
    const fundingStatus: FundingStatus = {
      ...defaultFundingStatus,
      status: "MEMPOOL",
    };
    const initialProps = {
      offerId: sellOffer.id,
      sellOffer,
      fundingStatus,
      userConfirmationRequired: true,
    };
    renderHook(useHandleFundingStatus, { initialProps });
    expect(replaceMock).toHaveBeenCalledWith("wrongFundingAmount", {
      offerId: sellOffer.id,
    });
  });
  it("should go to search if funding status is FUNDED with matches already", async () => {
    mockFetchMatches.mockResolvedValueOnce(searchWithMatches);

    renderHook(useHandleFundingStatus, { initialProps: fundedProps });
    await waitFor(() => expect(mockFetchMatches).toHaveBeenCalled());
    expect(replaceMock).toHaveBeenCalledWith("search", {
      offerId: sellOffer.id,
    });
  });
});
