import { renderHook, responseUtils, waitFor } from "test-utils";
import { sellOffer } from "../../../../tests/unit/data/offerData";
import { resetMock } from "../../../../tests/unit/helpers/NavigationWrapper";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { offerKeys } from "../../../hooks/query/useOfferDetail";
import { peachAPI } from "../../../utils/peachAPI";
import { useConfirmEscrow } from "./useConfirmEscrow";

const unauthorizedError = { error: "UNAUTHORIZED" } as const;

const mockShowErrorBanner = jest.fn();
jest.mock("../../../hooks/useShowErrorBanner", () => ({
  useShowErrorBanner: () => mockShowErrorBanner,
}));

const confirmEscrowMock = jest.spyOn(peachAPI.private.offer, "confirmEscrow");

jest.useFakeTimers();

describe("useConfirmEscrow", () => {
  const fundingStatusResponse = {
    offerId: sellOffer.id,
    escrow: "escrow",
    funding: sellOffer.funding,
    returnAddress: sellOffer.returnAddress,
    userConfirmationRequired: true,
  };
  beforeEach(() => {
    queryClient.setQueryData(
      offerKeys.fundingStatus(sellOffer.id),
      () => fundingStatusResponse,
    );
  });
  afterEach(() => {
    queryClient.clear();
  });
  it("shows error banner if escrow could not be confirmed", async () => {
    confirmEscrowMock.mockResolvedValueOnce({
      error: unauthorizedError,
      ...responseUtils,
    });
    const { result } = renderHook(useConfirmEscrow);
    result.current.mutate({
      offerId: sellOffer.id,
      funding: sellOffer.funding,
    });
    await waitFor(() => {
      expect(mockShowErrorBanner).toHaveBeenCalledWith(unauthorizedError.error);
    });
  });
  it("shows error banner if escrow server did not return result", async () => {
    confirmEscrowMock.mockResolvedValueOnce(responseUtils);
    const { result } = renderHook(useConfirmEscrow);
    result.current.mutate({
      offerId: sellOffer.id,
      funding: sellOffer.funding,
    });
    await waitFor(() => {
      expect(mockShowErrorBanner).toHaveBeenCalledWith(
        "Failed to confirm escrow",
      );
    });
  });
  it("confirms escrow and navigates to search if sell offer is funded", async () => {
    const { result } = renderHook(useConfirmEscrow);
    result.current.mutate({
      offerId: sellOffer.id,
      funding: { status: "FUNDED" } as FundingStatus,
    });
    await waitFor(() => {
      expect(
        queryClient.getQueryData(offerKeys.fundingStatus(sellOffer.id)),
      ).toEqual({
        ...fundingStatusResponse,
        userConfirmationRequired: false,
      });
    });
    expect(resetMock).toHaveBeenCalledWith({
      index: 1,
      routes: [
        { name: "homeScreen", params: { screen: "yourTrades" } },
        { name: "search", params: { offerId: sellOffer.id } },
      ],
    });
  });
  it("confirms escrow and navigates to fundEscrow if sell offer is not yet funded", async () => {
    const { result } = renderHook(useConfirmEscrow);
    result.current.mutate({
      offerId: sellOffer.id,
      funding: { status: "MEMPOOL" } as FundingStatus,
    });
    await waitFor(() => {
      expect(
        queryClient.getQueryData(offerKeys.fundingStatus(sellOffer.id)),
      ).toEqual({
        ...fundingStatusResponse,
        userConfirmationRequired: false,
      });
    });
    expect(resetMock).toHaveBeenCalledWith({
      index: 1,
      routes: [
        { name: "homeScreen", params: { screen: "yourTrades" } },
        { name: "fundEscrow", params: { offerId: sellOffer.id } },
      ],
    });
  });
});
