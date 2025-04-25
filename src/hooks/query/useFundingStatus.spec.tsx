import { renderHook, responseUtils, waitFor } from "test-utils";
import { sellOffer } from "../../../tests/unit/data/offerData";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { defaultFundingStatus } from "../../utils/offer/constants";
import { peachAPI } from "../../utils/peachAPI";
import { useFundingStatus } from "./useFundingStatus";

const defaultFundingStatusResponse = {
  funding: defaultFundingStatus,
  userConfirmationRequired: false,
};
const inMempool = {
  funding: {
    ...defaultFundingStatusResponse.funding,
    status: "MEMPOOL" as const,
  },
  userConfirmationRequired: true,
  returnAddress: "",
  escrow: "",
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
      fundingStatus: undefined,
      userConfirmationRequired: undefined,
      isLoading: true,
      isPending: true,
      error: null,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current).toEqual({
      fundingStatus: inMempool.funding,
      userConfirmationRequired: inMempool.userConfirmationRequired,
      isLoading: false,
      isPending: false,
      error: null,
    });
  });
  it("returns error", async () => {
    getFundingStatusMock.mockResolvedValueOnce({
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });

    const { result } = renderHook(useFundingStatus, {
      initialProps: sellOffer.id,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current).toEqual({
      fundingStatus: undefined,
      userConfirmationRequired: undefined,
      isLoading: false,
      isPending: false,
      error: new Error("UNAUTHORIZED"),
    });
  });
});
