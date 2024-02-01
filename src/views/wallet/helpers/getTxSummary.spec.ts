import { contractSummary } from "../../../../tests/unit/data/contractSummaryData";
import { buyOffer, sellOffer } from "../../../../tests/unit/data/offerData";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { useTradeSummaryStore } from "../../../store/tradeSummaryStore";
import { saveOffer } from "../../../utils/offer/saveOffer";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { getTxSummary } from "./getTxSummary";

jest.mock("../../../utils/transaction/txIsConfirmed", () => ({
  txIsConfirmed: jest.fn(() => true),
}));

const offerWithContract = {
  ...buyOffer,
  id: "offerWithContract",
  contractId: contractSummary.id,
};
const txId = "123";
const baseTx = {
  txid: txId,
  received: 0,
  sent: 0,
  confirmationTime: {
    height: 1,
    timestamp: 1234567890,
  },
};
const receivedTx = { ...baseTx, received: 100000000 };
const sentTx = { ...baseTx, sent: 100000000 };
const timestamp = 1234567890000;
const baseSummary = {
  id: "123",
  offerData: [],
  amount: 100000000,
  date: new Date(timestamp),
  height: 1,
  confirmed: true,
};

const buyOfferData = {
  offerId: buyOffer.id,
  amount: 50000,
  address: "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
  contractId: undefined,
  currency: undefined,
  price: undefined,
};

const buyOfferWithContractData = {
  offerId: offerWithContract.id,
  amount: contractSummary.amount,
  address: "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
  contractId: contractSummary.id,
  currency: "EUR",
  price: 21,
};

describe("getTxSummary", () => {
  beforeEach(() => {
    useSettingsStore.setState({
      displayCurrency: "USD",
    });
    useWalletState.getState().updateTxOfferMap(txId, [buyOffer.id]);
    saveOffer(buyOffer);
    saveOffer(offerWithContract);
  });

  it("returns transaction summary with offer id", () => {
    expect(getTxSummary(receivedTx)).toEqual({
      ...baseSummary,
      type: "TRADE",
      offerData: [buyOfferData],
    });
  });
  it("returns transaction summary with contract id", () => {
    useTradeSummaryStore
      .getState()
      .setContract(contractSummary.id, contractSummary);
    useWalletState.getState().updateTxOfferMap(txId, [offerWithContract.id]);
    expect(getTxSummary(receivedTx)).toEqual({
      ...baseSummary,
      offerData: [buyOfferWithContractData],
      type: "TRADE",
    });
  });
  it("returns the correct transaction summary object for a confirmed trade", () => {
    expect(getTxSummary(receivedTx)).toEqual({
      ...baseSummary,
      offerData: [buyOfferData],
      type: "TRADE",
    });
  });

  it("returns the correct transaction summary object for a refund", () => {
    // @ts-expect-error quickfix to create sell offer data we need
    saveOffer({ ...sellOffer, ...offerWithContract, type: "ask" });
    useTradeSummaryStore
      .getState()
      .setContract(contractSummary.id, contractSummary);
    useWalletState.getState().updateTxOfferMap(txId, [offerWithContract.id]);

    expect(getTxSummary(receivedTx)).toEqual({
      ...baseSummary,
      offerData: [buyOfferWithContractData],
      type: "REFUND",
    });
  });
  it("returns the correct transaction summary object for a deposit", () => {
    // @ts-expect-error quickfix to create sell offer data we need
    useWalletState.getState().updateTxOfferMap(txId, undefined);

    expect(getTxSummary(receivedTx)).toEqual({
      ...baseSummary,
      type: "DEPOSIT",
    });
  });
  it("returns the correct transaction summary object for a withdrawal", () => {
    expect(getTxSummary(sentTx)).toEqual({
      ...baseSummary,
      offerData: [buyOfferData],
      type: "WITHDRAWAL",
    });
  });
});
