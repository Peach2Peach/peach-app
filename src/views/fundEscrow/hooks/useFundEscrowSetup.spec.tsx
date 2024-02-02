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
import { defaultFundingStatus } from "../../../utils/offer/constants";
import { saveOffer } from "../../../utils/offer/saveOffer";
import { peachAPI } from "../../../utils/peachAPI";
import { PeachWallet } from "../../../utils/wallet/PeachWallet";
import { peachWallet, setPeachWallet } from "../../../utils/wallet/setWallet";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { useFundEscrowSetup } from "./useFundEscrowSetup";

jest.useFakeTimers();

const mockShowErrorBanner = jest.fn();
jest.mock("../../../hooks/useShowErrorBanner", () => ({
  useShowErrorBanner: () => mockShowErrorBanner,
}));

const mockUseFundingStatus = jest.fn().mockReturnValue({
  fundingStatus: defaultFundingStatus,
  userConfirmationRequired: false,
  isLoading: false,
});
jest.mock("../../../hooks/query/useFundingStatus", () => ({
  useFundingStatus: () => mockUseFundingStatus(),
}));

const sellOfferWithEscrow = { ...sellOffer, escrow: "escrow" };

const getOfferDetailsMock = jest
  .spyOn(peachAPI.private.offer, "getOfferDetails")
  .mockResolvedValue({ result: sellOfferWithEscrow, ...responseUtils });
jest.mock("./useHandleFundingStatus", () => ({
  useHandleFundingStatus: jest.fn(),
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
    expect(result.current).toEqual({
      offerId: sellOffer.id,
      fundingAddress: undefined,
      fundingAddresses: [],
      fundingStatus: defaultFundingStatus,
      fundingAmount: 0,
      cancelOffer: expect.any(Function),
    });
  });
  it("should return registered funding address for funding multiple offers", () => {
    saveOffer(sellOfferWithEscrow);

    const internalAddress = "internalAddress";
    useWalletState
      .getState()
      .registerFundMultiple(internalAddress, [sellOfferWithEscrow.id]);
    const { result } = renderHook(useFundEscrowSetup);

    expect(result.current.fundingAddress).toBe(internalAddress);
    expect(result.current.fundingAddresses).toEqual([
      sellOfferWithEscrow.escrow,
    ]);
  });
  it("should return default values with locally stored offer", () => {
    saveOffer(sellOfferWithEscrow);
    const { result } = renderHook(useFundEscrowSetup);

    expect(result.current).toEqual({
      offerId: sellOfferWithEscrow.id,
      fundingAddress: sellOfferWithEscrow.escrow,
      fundingAddresses: [sellOfferWithEscrow.escrow],
      fundingStatus: defaultFundingStatus,
      fundingAmount: sellOfferWithEscrow.amount,
      cancelOffer: expect.any(Function),
    });
  });
  it("should show error banner if there is an error with the funding status", () => {
    mockUseFundingStatus.mockReturnValueOnce({
      fundingStatus: defaultFundingStatus,
      userConfirmationRequired: false,
      isLoading: false,
      error: new Error(unauthorizedError.error),
    });
    renderHook(useFundEscrowSetup);
    expect(mockShowErrorBanner).toHaveBeenCalledWith(unauthorizedError.error);
  });
  it("should handle the case that no offer could be returned", () => {
    setAccount({ ...account1, offers: [] });

    getOfferDetailsMock.mockResolvedValueOnce({
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });
    const { result } = renderHook(useFundEscrowSetup);
    expect(result.current).toEqual({
      offerId: sellOffer.id,
      fundingAddress: undefined,
      fundingAddresses: [undefined],
      fundingStatus: defaultFundingStatus,
      fundingAmount: 0,
      cancelOffer: expect.any(Function),
    });
  });
  it("should handle the case that no offer could be returned but offer exists locally", () => {
    saveOffer(sellOfferWithEscrow);
    getOfferDetailsMock.mockResolvedValueOnce({
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });
    const { result } = renderHook(useFundEscrowSetup);
    expect(result.current).toEqual({
      offerId: sellOffer.id,
      fundingAddress: "escrow",
      fundingAddresses: ["escrow"],
      fundingStatus: defaultFundingStatus,
      fundingAmount: sellOffer.amount,
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
    saveOffer(sellOfferWithEscrow);

    const internalAddress = "internalAddress";
    useWalletState
      .getState()
      .registerFundMultiple(internalAddress, [sellOfferWithEscrow.id]);
    renderHook(useFundEscrowSetup);

    await act(async () => {
      await jest.advanceTimersByTimeAsync(MSINAMINUTE * 2);
    });

    expect(peachWallet.syncWallet).toHaveBeenCalledTimes(2);
  });
});
