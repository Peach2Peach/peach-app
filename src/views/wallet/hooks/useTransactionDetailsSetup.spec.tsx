import { renderHook, waitFor } from "test-utils";
import { buyOffer } from "../../../../tests/unit/data/offerData";
import {
  bdkTransactionWithRBF1,
  bitcoinJSTransactionWithRBF1,
  transactionWithRBF1,
  transactionWithRBF1Summary,
} from "../../../../tests/unit/data/transactionDetailData";
import { setRouteMock } from "../../../../tests/unit/helpers/NavigationWrapper";
import { saveOffer } from "../../../utils/offer/saveOffer";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { useTransactionDetailsSetup } from "./useTransactionDetailsSetup";

jest.useFakeTimers({ now: transactionWithRBF1Summary.date });

const minAmount = 900;
const maxAmount = 900;
describe("useTransactionDetailsSetup", () => {
  beforeAll(() => {
    useWalletState
      .getState()
      .updateTxOfferMap(transactionWithRBF1.txid, ["123"]);
    saveOffer({ ...buyOffer, amount: [minAmount, maxAmount], id: "123" });
    setRouteMock({
      name: "transactionDetails",
      key: "transactionDetails",
      params: { txId: transactionWithRBF1.txid },
    });
  });
  beforeEach(() => {
    useWalletState.getState().setTransactions([]);
  });

  it("should return defaults", () => {
    const { result } = renderHook(useTransactionDetailsSetup);
    expect(result.current).toEqual({
      transactionDetails: undefined,
      transactionSummary: undefined,
    });
  });
  it("should return local transaction", async () => {
    useWalletState.getState().setTransactions([bdkTransactionWithRBF1]);

    const { result } = renderHook(useTransactionDetailsSetup);
    expect(result.current.transactionSummary).toEqual(
      transactionWithRBF1Summary,
    );
    await waitFor(() =>
      expect(result.current.transactionDetails).toEqual(
        bitcoinJSTransactionWithRBF1,
      ),
    );
  });
});
