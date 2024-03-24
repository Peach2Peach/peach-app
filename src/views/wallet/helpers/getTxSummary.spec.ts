import { contractSummary } from "../../../../tests/unit/data/contractSummaryData";
import { buyOffer, sellOffer } from "../../../../tests/unit/data/offerData";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
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
  chain: "bitcoin",
  amount: 100000000,
  date: new Date(timestamp),
  height: 1,
  confirmed: true,
};

jest.useFakeTimers();

describe("getTxSummary", () => {
  beforeEach(() => {
    useSettingsStore.setState({
      displayCurrency: "USD",
    });
    useWalletState.getState().updateTxOfferMap(txId, [buyOffer.id]);
  });

  it("returns transaction summary with offer id", () => {
    expect(getTxSummary({ tx: receivedTx, offer: buyOffer })).toEqual({
      ...baseSummary,
      type: "TRADE",
    });
  });
  it("returns transaction summary with contract id", () => {
    expect(getTxSummary({ tx: receivedTx, offer: offerWithContract })).toEqual({
      ...baseSummary,
      type: "TRADE",
    });
  });

  it("returns the correct transaction summary object for a refund", () => {
    expect(
      getTxSummary({
        tx: receivedTx,
        offer: { ...sellOffer, contractId: contractSummary.id },
      }),
    ).toEqual({
      ...baseSummary,
      type: "REFUND",
    });
  });
  it("returns the correct transaction summary object for a deposit", () => {
    expect(getTxSummary({ tx: receivedTx, offer: undefined })).toEqual({
      ...baseSummary,
      type: "DEPOSIT",
    });
  });
  it("returns the correct transaction summary object for a withdrawal", () => {
    expect(getTxSummary({ tx: sentTx, offer: buyOffer })).toEqual({
      ...baseSummary,
      type: "WITHDRAWAL",
    });
  });
});
