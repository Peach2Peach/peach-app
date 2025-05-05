import { act, renderHook, waitFor } from "test-utils";
import { getError, getResult } from "../../../../peach-api/src/utils/result";
import { sellOffer } from "../../../../tests/unit/data/offerData";
import { unauthorizedError } from "../../../../tests/unit/data/peachAPIData";
import { setRouteMock } from "../../../../tests/unit/helpers/NavigationWrapper";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { MSINAMINUTE } from "../../../constants";
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

const mockUseEscrowInfo = jest.fn().mockReturnValue({
  fundingStatus: defaultFundingStatus,
  userConfirmationRequired: false,
  isLoading: false,
});
jest.mock("../../../hooks/query/useEscrowInfo", () => ({
  useEscrowInfo: () => mockUseEscrowInfo(),
}));

const sellOfferWithEscrow = { ...sellOffer, escrow: "escrow" };

const getOfferDetailsMock = jest
  .spyOn(peachAPI.private.offer, "getOfferDetails")
  .mockResolvedValue(getResult(sellOfferWithEscrow));
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
    useWalletState.getState().reset();
  });
  afterEach(() => {
    queryClient.clear();
  });

  it("should return default values", () => {
    const { result } = renderHook(useFundEscrowSetup);
    expect(result.current).toEqual({
      isPending: true,
      fundingAddress: undefined,
      fundingAddresses: [],
      fundingStatus: defaultFundingStatus,
      fundingAmount: 0,
      offerIdsWithoutEscrow: [],
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
      isPending: false,
      fundingAddress: sellOfferWithEscrow.escrow,
      fundingAddresses: [sellOfferWithEscrow.escrow],
      fundingStatus: defaultFundingStatus,
      fundingAmount: sellOfferWithEscrow.amount,
      offerIdsWithoutEscrow: [],
    });
  });
  it("should show error banner if there is an error with the funding status", () => {
    mockUseEscrowInfo.mockReturnValueOnce({
      fundingStatus: defaultFundingStatus,
      userConfirmationRequired: false,
      isLoading: false,
      error: new Error(unauthorizedError.error),
    });
    renderHook(useFundEscrowSetup);
    expect(mockShowErrorBanner).toHaveBeenCalledWith(unauthorizedError.error);
  });
  it("should handle the case that no offer could be returned", () => {
    getOfferDetailsMock.mockResolvedValueOnce(
      getError({ error: "UNAUTHORIZED" }),
    );
    const { result } = renderHook(useFundEscrowSetup);
    expect(result.current).toEqual({
      isPending: true,
      fundingAddress: undefined,
      fundingAddresses: [],
      fundingStatus: defaultFundingStatus,
      fundingAmount: 0,
      offerIdsWithoutEscrow: [],
    });
  });
  it("should handle the case that no offer could be returned but offer exists locally", () => {
    saveOffer(sellOfferWithEscrow);
    getOfferDetailsMock.mockResolvedValueOnce(
      getError({ error: "UNAUTHORIZED" }),
    );
    const { result } = renderHook(useFundEscrowSetup);
    expect(result.current).toEqual({
      isPending: false,
      fundingAddress: "escrow",
      fundingAddresses: ["escrow"],
      fundingStatus: defaultFundingStatus,
      fundingAmount: sellOffer.amount,
      offerIdsWithoutEscrow: [],
    });
  });
  it("should sync the wallet on mount", async () => {
    if (!peachWallet) throw new Error("PeachWallet not set");
    peachWallet.initialized = true;
    renderHook(useFundEscrowSetup);

    await waitFor(() => {
      if (!peachWallet) throw new Error("PeachWallet not set");
      expect(peachWallet.syncWallet).toHaveBeenCalledTimes(1);
    });
  });
  it("should periodically sync peach wallet if funding multiple escrow", async () => {
    if (!peachWallet) throw new Error("PeachWallet not set");
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
