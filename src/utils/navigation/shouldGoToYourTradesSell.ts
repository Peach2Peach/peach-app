export const shouldGoToYourTradesSell = ({ data }: { data: PNData }) =>
  !!data.offerId
  && (data.type === 'offer.sellOfferExpired'
    || data.type === 'offer.fundingAmountDifferent'
    || data.type === 'offer.wrongFundingAmount')
