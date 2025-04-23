import { buyOffer, sellOffer } from "../../../tests/unit/data/offerData";
import { buyOfferSummary } from "../../../tests/unit/data/offerSummaryData";
import { confirmed1 } from "../../../tests/unit/data/transactionDetailData";
import { offerKeys } from "../../hooks/query/offerKeys";
import { queryClient } from "../../queryClient";
import { labelAddressByTransaction } from "./labelAddressByTransaction";
import { useWalletState } from "./walletStore";

jest.useFakeTimers();

describe("labelAddressByTransaction", () => {
  beforeEach(() => {
    useWalletState.getState().reset();
    queryClient.setQueryData(offerKeys.detail(buyOffer.id), buyOffer);
    queryClient.setQueryData(offerKeys.detail(sellOffer.id), sellOffer);
  });
  afterEach(() => {
    queryClient.clear();
  });
  it("does not label address if associated offer cannot be found", async () => {
    useWalletState
      .getState()
      .updateTxOfferMap(confirmed1.txid, [buyOfferSummary.id]);
    await labelAddressByTransaction(confirmed1);
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
    queryClient.setQueryData(offerKeys.detail(buyOffer.id), {
      ...buyOffer,
      contractId: "11-12",
    });
    await labelAddressByTransaction(confirmed1);
    expect(useWalletState.getState().addressLabelMap).toEqual({
      bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh:
        "PC‑B‑C",
    });
  });

  it("does not label address if tx default label cannot be determined", async () => {
    useWalletState.getState().updateTxOfferMap(confirmed1.txid, []);

    await labelAddressByTransaction(confirmed1);
    expect(useWalletState.getState().addressLabelMap).toEqual({});
  });
});
