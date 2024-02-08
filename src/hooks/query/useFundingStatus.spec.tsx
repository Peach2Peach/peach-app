import { renderHook, responseUtils, waitFor } from "test-utils";
import { sellOffer } from "../../../tests/unit/data/offerData";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { getDefaultFundingStatus } from "../../utils/offer/constants";
import { peachAPI } from "../../utils/peachAPI";
import { useFundingStatus } from "./useFundingStatus";

const defaultFundingStatusResponse = {
  funding: getDefaultFundingStatus(sellOffer.id),
  userConfirmationRequired: false,
};
const inMempool = {
  funding: {
    ...defaultFundingStatusResponse.funding,
    status: "MEMPOOL" as FundingStatus['status'],
  },
  fundingLiquid: {
    ...defaultFundingStatusResponse.funding,
    status: "NULL" as FundingStatus['status'],
  },
  userConfirmationRequired: true,
  returnAddress: "",
  escrow: "",
  escrows: {},
  offerId: "",
};

const getFundingStatusMock = jest.spyOn(
  peachAPI.private.offer,
  "getFundingStatus",
);
jest.useFakeTimers();

describe("useFundingStatus", () => {
  afterEach(() => {
    queryClient.clear();
  });
  it("fetches funding status from API", async () => {
    getFundingStatusMock.mockResolvedValueOnce({
      result: inMempool,
      ...responseUtils,
    });

    const { result } = renderHook(useFundingStatus, {
      initialProps: sellOffer.id,
    });

    expect(result.current).toEqual({
      fundingStatus: getDefaultFundingStatus(sellOffer.id),
      fundingStatusLiquid: getDefaultFundingStatus(sellOffer.id),
      userConfirmationRequired: false,
      isLoading: true,
      error: null,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current).toEqual({
      fundingStatus: inMempool.funding,
      fundingStatusLiquid: inMempool.fundingLiquid,
      userConfirmationRequired: inMempool.userConfirmationRequired,
      isLoading: false,
      error: null,
    });
  });
  it("returns default funding status if API does not return one", async () => {
    getFundingStatusMock.mockResolvedValueOnce({
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });

    const { result } = renderHook(useFundingStatus, {
      initialProps: sellOffer.id,
    });

    expect(result.current).toEqual({
      fundingStatus: getDefaultFundingStatus(sellOffer.id),
      fundingStatusLiquid: getDefaultFundingStatus(sellOffer.id),
      userConfirmationRequired: false,
      isLoading: true,
      error: null,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current).toEqual({
      fundingStatus: getDefaultFundingStatus(sellOffer.id),
      fundingStatusLiquid: getDefaultFundingStatus(sellOffer.id),
      userConfirmationRequired: false,
      isLoading: false,
      error: new Error("UNAUTHORIZED"),
    });
  });
});
