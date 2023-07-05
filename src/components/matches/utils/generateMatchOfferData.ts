import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { isBuyOffer } from '../../../utils/offer'
import { MatchProps } from '../../../utils/peachAPI/private/offer/matchOffer'
import { addPaymentDetailInfoByHash } from './addPaymentDetailInfoByHash'
import { createEncryptedKey } from './createEncryptedKey'
import { createEncryptedPaymentData } from './createEncryptedPaymentData'

export const generateMatchOfferData = async (
  offer: BuyOffer | SellOffer,
  match: Match,
  selectedCurrency: Currency,
  selectedPaymentMethod: PaymentMethod,
  // eslint-disable-next-line max-params
): Promise<[MatchProps | null, string | null]> => {
  const defaultOfferData = {
    offerId: offer.id,
    matchingOfferId: match.offerId,
    currency: selectedCurrency,
    paymentMethod: selectedPaymentMethod,
    symmetricKeyEncrypted: undefined,
    symmetricKeySignature: undefined,
    paymentDataEncrypted: undefined,
    paymentDataSignature: undefined,
  }

  if (isBuyOffer(offer)) {
    const { encrypted: symmetricKeyEncrypted, signature: symmetricKeySignature } = await createEncryptedKey(match)
    return [
      {
        ...defaultOfferData,
        symmetricKeyEncrypted,
        symmetricKeySignature,
      },
      null,
    ]
  }

  const hashes = offer.paymentData[selectedPaymentMethod]?.hashes
  if (!hashes) return [null, 'MISSING_HASHED_PAYMENT_DATA']

  const paymentDataForMethod = hashes.reduce(
    addPaymentDetailInfoByHash(usePaymentDataStore.getState().paymentDetailInfo),
    {} as PaymentData,
  )

  const encryptedPaymentData = await createEncryptedPaymentData(match, paymentDataForMethod)
  if (!encryptedPaymentData) return [null, 'PAYMENTDATA_ENCRYPTION_FAILED']

  return [
    {
      ...defaultOfferData,
      paymentDataEncrypted: encryptedPaymentData.encrypted,
      paymentDataSignature: encryptedPaymentData.signature,
    },
    null,
  ]
}
