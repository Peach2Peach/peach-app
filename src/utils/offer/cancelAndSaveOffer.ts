import { CancelOfferResponseBody } from 'peach-api/src/@types/api/offerAPI'
import { isSellOffer, saveOffer } from '.'
import { error, info } from '../log'
import { peachAPI } from '../peachAPI'

export const cancelAndSaveOffer = async (
  offer: BuyOffer | SellOffer,
): Promise<[CancelOfferResponseBody | undefined, APIError | undefined]> => {
  if (!offer.id) return [undefined, { error: 'GENERAL_ERROR' }]

  const { result, error: err } = await peachAPI.private.offer.cancelOffer({
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
