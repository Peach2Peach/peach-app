export const isCanceledOffer = (
  offer: BuyOffer | SellOffer | null | undefined,
): offer is (BuyOffer | SellOffer) & { tradeStatus: 'offerCanceled' } => offer?.tradeStatus === 'offerCanceled'
