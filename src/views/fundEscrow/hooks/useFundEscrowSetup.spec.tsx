import { act, renderHook, responseUtils, waitFor } from "test-utils";
import { account1 } from "../../../../tests/unit/data/accountData";
import { sellOffer } from "../../../../tests/unit/data/offerData";
import { unauthorizedError } from "../../../../tests/unit/data/peachAPIData";
import { setRouteMock } from "../../../../tests/unit/helpers/NavigationWrapper";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { MSINAMINUTE } from "../../../constants";
import { setAccount } from "../../../utils/account/account";
import { updateAccount } from "../../../utils/account/updateAccount";
import { getDefaultFundingStatus } from "../../../utils/offer/constants";
import { saveOffer } from "../../../utils/offer/saveOffer";
import { peachAPI } from "../../../utils/peachAPI";
import { PeachWallet } from "../../../utils/wallet/PeachWallet";
import { peachWallet, setPeachWallet } from "../../../utils/wallet/setWallet";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { useFundEscrowSetup } from "./useFundEscrowSetup";

jest.useFakeTimers();

const showErrorBannerMock = jest.fn();
jest.mock("../../../hooks/useShowErrorBanner", () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}));

const useFundingStatusMock = jest.fn().mockReturnValue({
  fundingStatus: getDefaultFundingStatus(sellOffer.id),
  fundingStatusLiquid: getDefaultFundingStatus(sellOffer.id),
  userConfirmationRequired: false,
  isLoading: false,
});
jest.mock("../../../hooks/query/useFundingStatus", () => ({
  useFundingStatus: () => useFundingStatusMock(),
}));

const getOfferDetailsMock = jest
  .spyOn(peachAPI.private.offer, "getOfferDetails")
  .mockResolvedValue({ result: sellOffer, ...responseUtils });
jest.mock("./useHandleFundingStatus", () => ({
  useHandleFundingStatus: () => jest.fn(),
}));

describe("useFundEscrowSetup", () => {
  beforeAll(() => {
    setRouteMock({
      name: "fundEscrow",
      key: "fundEscrow",
      params: { offerId: sellOffer.id },
    });
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }));
  });
  beforeEach(() => {
    updateAccount({ ...account1, offers: [] }, true);
    useWalletState.getState().reset();
  });
  afterEach(() => {
    queryClient.clear();
  });

  it("should return default values", () => {
    const { result } = renderHook(useFundEscrowSetup);
    const activeFunding = getDefaultFundingStatus(sellOffer.id)
    expect(result.current).toEqual({
      offerId: sellOffer.id,
      funding: {
        bitcoin: {
          fundingAddress: undefined,
          fundingAddresses: [],
          fundingStatus: activeFunding,
        },
        liquid: {
          fundingAddress: undefined,
          fundingAddresses: [],
          fundingStatus: getDefaultFundingStatus(sellOffer.id),
        }
      },
      activeFunding,
      fundingAmount: 0,
      cancelOffer: expect.any(Function),
    });
  });
  it("should return registered funding address for funding multiple offers", () => {
    saveOffer(sellOffer);

    const internalAddress = "internalAddress";
    useWalletState
      .getState()
      .registerFundMultiple(internalAddress, [sellOffer.id]);
    const { result } = renderHook(useFundEscrowSetup);

    expect(result.current.funding.bitcoin.fundingAddress).toBe(internalAddress);
    expect(result.current.funding.bitcoin.fundingAddresses).toEqual([
      sellOffer.escrows.bitcoin,
    ]);
  });
  it("should return default values with locally stored offer", () => {
    saveOffer(sellOffer);
    const { result } = renderHook(useFundEscrowSetup);
    const activeFunding = getDefaultFundingStatus(sellOffer.id)

    expect(result.current).toEqual({
      offerId: sellOffer.id,
      funding: {
        bitcoin: {
          fundingAddress: sellOffer.escrows.bitcoin,
          fundingAddresses: [sellOffer.escrows.bitcoin],
          fundingStatus: activeFunding,
        },
        liquid: {
          fundingAddress: sellOffer.escrows.liquid,
          fundingAddresses: [sellOffer.escrows.liquid],
          fundingStatus: getDefaultFundingStatus(sellOffer.id),
        }
      },
      activeFunding,
      fundingAmount: sellOffer.amount,
      cancelOffer: expect.any(Function),
    });
  });
  it("should show error banner if there is an error with the funding status", () => {
    useFundingStatusMock.mockReturnValueOnce({
      fundingStatus: getDefaultFundingStatus(sellOffer.id),
      fundingStatusLiquid: getDefaultFundingStatus(sellOffer.id),
      userConfirmationRequired: false,
      isLoading: false,
      error: new Error(unauthorizedError.error),
    });
    renderHook(useFundEscrowSetup);
    expect(showErrorBannerMock).toHaveBeenCalledWith(unauthorizedError.error);
  });
  it("should handle the case that no offer could be returned", () => {
    setAccount({ ...account1, offers: [] });
    const activeFunding = getDefaultFundingStatus(sellOffer.id)

    getOfferDetailsMock.mockResolvedValueOnce({
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });
    const { result } = renderHook(useFundEscrowSetup);
    expect(result.current).toEqual({
      offerId: sellOffer.id,
      funding: {
        bitcoin: {
          fundingAddress: undefined,
          fundingAddresses: [],
          fundingStatus: activeFunding,
        },
        liquid: {
          fundingAddress: undefined,
          fundingAddresses: [],
          fundingStatus: getDefaultFundingStatus(sellOffer.id),
        }
      },
      activeFunding,
      fundingAmount: 0,
      cancelOffer: expect.any(Function),
    });
  });
  it("should sync the wallet on mount", async () => {
    peachWallet.initialized = true;
    renderHook(useFundEscrowSetup);

    await waitFor(() => {
      expect(peachWallet.syncWallet).toHaveBeenCalledTimes(1);
    });
  });
  it("should periodically sync peach wallet if funding multiple escrow", async () => {
    peachWallet.initialized = true;
    saveOffer(sellOffer);

    const internalAddress = "internalAddress";
    useWalletState
      .getState()
      .registerFundMultiple(internalAddress, [sellOffer.id]);
    renderHook(useFundEscrowSetup);

    await act(async () => {
      await jest.advanceTimersByTimeAsync(MSINAMINUTE * 2);
    });

    expect(peachWallet.syncWallet).toHaveBeenCalledTimes(2);
  });
});
