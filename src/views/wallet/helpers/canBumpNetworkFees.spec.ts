import {
  confirmedTransactionSummary,
  pending1,
  pendingReceived1,
  pendingReceivedTransactionSummary,
  pendingTransactionSummary,
} from "../../../../tests/unit/data/transactionDetailData";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { PeachWallet } from "../../../utils/wallet/PeachWallet";
import { setPeachWallet } from "../../../utils/wallet/setWallet";
import { canBumpNetworkFees } from "./canBumpNetworkFees";

describe("canBumpNetworkFees", () => {
  const peachWallet = new PeachWallet({ wallet: createTestWallet() });
  peachWallet.transactions = [pending1, pendingReceived1];
  setPeachWallet(peachWallet);
  it("returns true if transaction is unconfirmed and known to wallet", () => {
    expect(canBumpNetworkFees(pendingTransactionSummary)).toBeTruthy();
  });
  it("returns false if transaction is confirmed", () => {
    expect(canBumpNetworkFees(confirmedTransactionSummary)).toBeFalsy();
  });
  it("returns false if transaction has no outgoing sats", () => {
    expect(canBumpNetworkFees(pendingReceivedTransactionSummary)).toBeFalsy();
  });
  it("returns false if transaction is unconfirmed but not known to wallet", () => {
    peachWallet.transactions = [];
    expect(canBumpNetworkFees(pendingTransactionSummary)).toBeFalsy();
  });
});
