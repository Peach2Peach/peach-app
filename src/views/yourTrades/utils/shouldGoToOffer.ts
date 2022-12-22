export const shouldGoToOffer = ({ requiredAction, status }: TradeStatus): boolean =>
  !/rate/u.test(requiredAction)
  && /offerPublished|searchingForPeer|offerCanceled|tradeCompleted|tradeCanceled/u.test(status)
