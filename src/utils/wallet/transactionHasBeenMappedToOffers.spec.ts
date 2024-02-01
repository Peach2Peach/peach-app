import { offerSummary } from "../../../tests/unit/data/offerSummaryData";
import { confirmed1 } from "../../../tests/unit/data/transactionDetailData";
import { transactionHasBeenMappedToOffers } from "./transactionHasBeenMappedToOffers";
import { useWalletState } from "./walletStore";

describe("transactionHasBeenMappedToOffer", () => {
  afterEach(() => {
    useWalletState.getState().reset();
  });

  it("returns false if tx has not yet been mapped to offer", () => {
    expect(transactionHasBeenMappedToOffers(confirmed1)).toBeFalsy();
  });

  it("returns true if tx has been mapped to offer", () => {
    useWalletState
      .getState()
      .updateTxOfferMap(confirmed1.txid, [offerSummary.id]);
    expect(transactionHasBeenMappedToOffers(confirmed1)).toBeTruthy();
  });
});
