export const shouldGoToSell = ({ data: { offerId, type } }: { data: PNData }) => !!offerId && type === 'offer.notFunded'
