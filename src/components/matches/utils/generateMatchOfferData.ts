import { getPaymentDataByMethod, isBuyOffer } from '../../../utils/offer'
import { MatchProps } from '../../../utils/peachAPI/private/offer/matchOffer'
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
    offerId: offer.id!,
    matchingOfferId: match.offerId,
    currency: selectedCurrency,
    paymentMethod: selectedPaymentMethod,
    symmetricKeyEncrypted: undefined,
    symmetricKeySignature: undefined,
    paymentDataEncrypted: undefined,
    paymentDataSignature: undefined,
    hashedPaymentData: offer.paymentData[selectedPaymentMethod]!.hash,
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

  const paymentDataForMethod = getPaymentDataByMethod(offer, selectedPaymentMethod)
  if (!paymentDataForMethod) return [null, 'MISSING_PAYMENTDATA']

  const encryptedPaymentData = await createEncryptedPaymentData(match, paymentDataForMethod)
  if (!encryptedPaymentData) return [null, 'DECRYPTION_FAILED']

  return [
    {
      ...defaultOfferData,
      paymentDataEncrypted: encryptedPaymentData?.encrypted,
      paymentDataSignature: encryptedPaymentData?.signature,
    },
    null,
  ]
}
