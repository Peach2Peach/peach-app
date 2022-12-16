import { getPaymentDataByMethod, isBuyOffer } from '../../../utils/offer'
import { createEncryptedKey } from './createEncryptedKey'
import { createEncryptedPaymentData } from './createEncryptedPaymentData'

export const generateMatchOfferData = async (
  offer: (BuyOffer | SellOffer) & { id: string },
  match: Match,
  selectedCurrency: Currency,
  selectedPaymentMethod: PaymentMethod,
  // eslint-disable-next-line max-params
) => {
  const hashedPaymentData = offer.paymentData[selectedPaymentMethod]?.hash
  if (hashedPaymentData === undefined) return 'Missing paymentData hash'
  const defaultOfferData = {
    offerId: offer.id,
    matchingOfferId: match.offerId,
    currency: selectedCurrency,
    paymentMethod: selectedPaymentMethod,
    symmetricKeyEncrypted: undefined,
    symmetricKeySignature: undefined,
    paymentDataEncrypted: undefined,
    paymentDataSignature: undefined,
    hashedPaymentData,
  }

  if (isBuyOffer(offer)) {
    const { encrypted: symmetricKeyEncrypted, signature: symmetricKeySignature } = await createEncryptedKey(match)
    return {
      ...defaultOfferData,
      symmetricKeyEncrypted,
      symmetricKeySignature,
    }
  }

  const paymentDataForMethod = getPaymentDataByMethod(offer, selectedPaymentMethod, hashedPaymentData)
  if (!paymentDataForMethod) return 'Missing paymentData'

  const encryptedPaymentData = await createEncryptedPaymentData(match, paymentDataForMethod)
  if (!encryptedPaymentData) return `symmetric key could not be decrypted for ${match.offerId}`

  return {
    ...defaultOfferData,
    paymentDataEncrypted: encryptedPaymentData?.encrypted,
    paymentDataSignature: encryptedPaymentData?.signature,
  }
}
