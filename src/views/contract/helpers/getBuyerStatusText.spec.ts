import i18n from "../../../utils/i18n";
import { getBuyerStatusText } from "./getBuyerStatusText";

const isPaymentTooLateMock = jest.fn((..._args) => false);
jest.mock("../../../utils/contract/status/isPaymentTooLate", () => ({
  isPaymentTooLate: (...args: unknown[]) => isPaymentTooLateMock(...args),
}));

describe("getBuyerStatusText", () => {
  const mockContract = {
    tradeStatus: "tradeCompleted",
    paymentMade: new Date(),
    paymentMethod: "sepa",
  } as unknown as Contract;
  it("should return correct text if seller requested cancelation", () => {
    expect(
      getBuyerStatusText({ ...mockContract, cancelationRequested: true }),
    ).toBe(i18n("contract.buyer.collaborativeCancel.notResolved"));
  });
  it("should return correct text if the buyer canceled the trade, it's not a cash trade and not collab cancel", () => {
    expect(
      getBuyerStatusText({
        ...mockContract,
        canceled: true,
        canceledBy: "buyer",
        cancelationRequested: false,
      }),
    ).toBe(i18n("contract.buyer.buyerCanceledTrade"));
  });
  it("should return correct text if the buyer canceled the trade and it's a cash trade", () => {
    expect(
      getBuyerStatusText({
        ...mockContract,
        canceled: true,
        canceledBy: "buyer",
        paymentMethod: "cash.someMeetup",
      }),
    ).toBe(i18n("contract.buyer.buyerCanceledCashTrade"));
  });
  it("should return correct text if the buyer canceled the trade and it's a collab cancel", () => {
    expect(
      getBuyerStatusText({
        ...mockContract,
        canceled: true,
        canceledBy: "buyer",
        cancelationRequested: true,
      }),
    ).toBe("You agreed to cancel the trade, and the seller has been refunded.");
  });
  it("should return correct text if seller canceled cash trade", () => {
    expect(
      getBuyerStatusText({
        ...mockContract,
        canceled: true,
        canceledBy: "seller",
        paymentMethod: "cash.someMeetup",
      }),
    ).toBe(i18n("contract.buyer.sellerCanceledCashTrade"));
  });
  it("should return correct text if payment is too late", () => {
    isPaymentTooLateMock.mockReturnValueOnce(true);
    expect(getBuyerStatusText(mockContract)).toBe(
      i18n("contract.buyer.paymentWasTooLate.waitingForSeller"),
    );
  });
  it("should return the correct text if buyer lost a dispute", () => {
    expect(
      getBuyerStatusText({ ...mockContract, disputeWinner: "seller" }),
    ).toBe(i18n("contract.buyer.disputeLost"));
  });
  it("should return the correct text if buyer won a dispute and is waiting for the seller to pay", () => {
    expect(
      getBuyerStatusText({
        ...mockContract,
        disputeWinner: "buyer",
        releaseTxId: undefined,
      }),
    ).toBe(i18n("contract.buyer.disputeWon.awaitingPayout"));
  });
  it("should return correct text if the buyer won a dispute and the seller paid", () => {
    expect(
      getBuyerStatusText({
        ...mockContract,
        disputeWinner: "buyer",
        releaseTxId: "123",
      }),
    ).toBe(i18n("contract.buyer.disputeWon.paidOut"));
  });
});
