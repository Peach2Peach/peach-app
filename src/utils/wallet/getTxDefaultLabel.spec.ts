import { contractSummary } from "../../../tests/unit/data/contractSummaryData";
import { offerSummary } from "../../../tests/unit/data/offerSummaryData";
import { confirmed1 } from "../../../tests/unit/data/transactionDetailData";
import { useTradeSummaryStore } from "../../store/tradeSummaryStore";
import { getTxDefaultLabel } from "./getTxDefaultLabel";
import { useWalletState } from "./walletStore";

describe("getTxDefaultLabel", () => {
  const offerWithContract = {
    ...offerSummary,
    id: "offerWithContract",
    contractId: contractSummary.id,
  };

  afterEach(() => {
    useWalletState.getState().reset();
  });
  it("returns the default label for a tx with contract", () => {
    useTradeSummaryStore.getState().setOffers([offerWithContract]);
    useTradeSummaryStore.getState().setContracts([contractSummary]);

    useWalletState
      .getState()
      .updateTxOfferMap(confirmed1.txid, [offerWithContract.id]);

    expect(getTxDefaultLabel(confirmed1)).toBe("PC‑7B‑1C8");
  });
  it("returns the default label for a tx with offer", () => {
    useTradeSummaryStore.getState().setOffers([offerSummary]);

    useWalletState
      .getState()
      .updateTxOfferMap(confirmed1.txid, [offerSummary.id]);

    expect(getTxDefaultLabel(confirmed1)).toBe("P‑1C8");
  });
  it("returns the default label for a tx with multiple offers", () => {
    const offerSummary2 = { ...offerSummary, id: "3" };
    useTradeSummaryStore.getState().setOffers([offerSummary, offerSummary2]);

    useWalletState
      .getState()
      .updateTxOfferMap(confirmed1.txid, [offerSummary.id, offerSummary2.id]);

    expect(getTxDefaultLabel(confirmed1)).toBe("P‑1C8, P‑3");
  });
  it("returns no label for a standalone tx", () => {
    expect(getTxDefaultLabel(confirmed1)).toBe("");
  });
});
