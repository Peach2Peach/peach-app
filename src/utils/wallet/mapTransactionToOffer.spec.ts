import { confirmed1 } from "../../../tests/unit/data/transactionDetailData";
import { mapTransactionToOffer } from "./mapTransactionToOffer";
import { useWalletState } from "./walletStore";

describe("mapTransactionToOffer", () => {
  beforeEach(() => {
    useWalletState.getState().reset();
  });

  it("maps transaction to sell offer id", () => {
    mapTransactionToOffer({
      offerSummaries: [{ fundingTxId: confirmed1.txid, id: "2" }],
      contractSummaries: [],
    })(confirmed1);
    expect(useWalletState.getState().txOfferMap).toEqual({
      txid1_confirmed: ["2"],
    });
  });
  it("maps transaction to multiple sell offer id", () => {
    mapTransactionToOffer({
      offerSummaries: [
        { id: "2", fundingTxId: confirmed1.txid },
        { id: "3", fundingTxId: confirmed1.txid },
      ],
      contractSummaries: [],
    })(confirmed1);
    expect(useWalletState.getState().txOfferMap).toEqual({
      txid1_confirmed: ["2", "3"],
    });
  });
  it("maps transaction to buy offer id", () => {
    mapTransactionToOffer({
      offerSummaries: [],
      contractSummaries: [{ releaseTxId: confirmed1.txid, id: "1-3" }],
    })(confirmed1);
    expect(useWalletState.getState().txOfferMap).toEqual({
      txid1_confirmed: ["3"],
    });
  });
  it("maps transaction to multiple buy offer ids", () => {
    mapTransactionToOffer({
      offerSummaries: [{ id: "3" }, { id: "4" }],
      contractSummaries: [
        { id: "1-3", releaseTxId: confirmed1.txid },
        { id: "1-4", releaseTxId: confirmed1.txid },
      ],
    })(confirmed1);
    expect(useWalletState.getState().txOfferMap).toEqual({
      txid1_confirmed: ["3", "4"],
    });
  });
  it("does not map transaction if no offer can be associated with it", () => {
    mapTransactionToOffer({
      offerSummaries: [],
      contractSummaries: [],
    })(confirmed1);
    expect(useWalletState.getState().txOfferMap).toEqual({});
  });
});
