import { error, info } from '../log'
import { cancelOffer } from '../peachAPI'
import { isSellOffer } from './isSellOffer'
import { saveOffer } from './saveOffer'

export const cancelAndSaveOffer = async (
  offer: BuyOffer | SellOffer,
): Promise<[CancelOfferResponse | null, APIError | null]> => {
  if (!offer.id) return [null, { error: 'GENERAL_ERROR' }]

  const [result, err] = await cancelOffer({
    offerId: offer.id,
  })
  if (result) {
    info('Cancel offer: ', JSON.stringify(result))
    if (isSellOffer(offer)) {
      saveOffer({
        ...offer,
        online: false,
        funding: {
          ...offer.funding,
          status: 'CANCELED',
        },
      })
    } else {
      saveOffer({ ...offer, online: false })
    }
  } else if (err) {
    error('Error', err)
  }

  return [result, err]
}
