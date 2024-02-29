import { responseUtils } from "test-utils";
import { buyOffer, sellOffer } from "../../../tests/unit/data/offerData";
import { offerSummary } from "../../../tests/unit/data/offerSummaryData";
import { confirmed1 } from "../../../tests/unit/data/transactionDetailData";
import { queryClient } from "../../queryClient";
import { peachAPI } from "../peachAPI";
import { labelAddressByTransaction } from "./labelAddressByTransaction";
import { useWalletState } from "./walletStore";

const getOfferSpy = jest
  .spyOn(peachAPI.private.offer, "getOfferDetails")
  .mockImplementation(({ offerId }) => {
    if (offerId === buyOffer.id) {
      return Promise.resolve({ result: buyOffer, ...responseUtils });
    }
    if (offerId === sellOffer.id) {
      return Promise.resolve({ result: sellOffer, ...responseUtils });
    }
    return Promise.resolve({ result: undefined, ...responseUtils });
  });
describe("labelAddressByTransaction", () => {
  beforeEach(() => {
    useWalletState.getState().reset();
  });
  afterEach(() => {
    queryClient.clear();
  });
  it("does not label address if associated offer cannot be found", () => {
    useWalletState
      .getState()
      .updateTxOfferMap(confirmed1.txid, [offerSummary.id]);
    labelAddressByTransaction(confirmed1);
    expect(useWalletState.getState().addressLabelMap).toEqual({});
  });
  it("labels address if associated buy offer can be found", async () => {
    useWalletState.getState().updateTxOfferMap(confirmed1.txid, [buyOffer.id]);
    await labelAddressByTransaction(confirmed1);
    expect(useWalletState.getState().addressLabelMap).toEqual({
      bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh: "P‑25",
    });
  });
  it("labels address if associated sell offer can be found", async () => {
    useWalletState.getState().updateTxOfferMap(confirmed1.txid, [sellOffer.id]);
    await labelAddressByTransaction(confirmed1);
    expect(useWalletState.getState().addressLabelMap).toEqual({
      bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh: "P‑26",
    });
  });
  it("labels address if associated contractId can be found", async () => {
    useWalletState.getState().updateTxOfferMap(confirmed1.txid, [buyOffer.id]);
    getOfferSpy.mockResolvedValueOnce({
      result: { ...buyOffer, contractId: "11-12" },
      ...responseUtils,
    });
    await labelAddressByTransaction(confirmed1);
    expect(useWalletState.getState().addressLabelMap).toEqual({
      bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh:
        "PC‑B‑C",
    });
  });

  it("does not label address if tx default label cannot be determined", () => {
    useWalletState.getState().updateTxOfferMap(confirmed1.txid, [sellOffer.id]);

    labelAddressByTransaction(confirmed1);
    expect(useWalletState.getState().addressLabelMap).toEqual({});
  });
});
