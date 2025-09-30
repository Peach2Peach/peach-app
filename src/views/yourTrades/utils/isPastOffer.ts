const pastOfferStatus = [
  "tradeCompleted",
  "tradeCanceled",
  "offerCanceled",
  "wrongAmountFundedOnContract",
];

export const isPastOffer = (
  tradeStatus: TradeStatus,
  userType?: "bid" | "ask",
) => {
  return (
    pastOfferStatus.includes(tradeStatus) ||
    (tradeStatus === "wrongAmountFundedOnContractRefundWaiting" &&
      userType === "bid")
  );
};
