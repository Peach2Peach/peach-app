import { getPaymentDataByMethod } from '../../../utils/offer'
import { createEncryptedKey } from './createEncryptedKey'
import { createEncryptedPaymentData } from './createEncryptedPaymentData'

export const generateMatchOfferData = async (
  offer: BuyOffer | SellOffer,
  match: Match,
  selectedCurrency: Currency,
  selectedPaymentMethod: PaymentMethod,
  // eslint-disable-next-line max-params
) => {
  let encryptedSymmmetricKey
  let encryptedPaymentData
  if (offer.type === 'bid') {
    encryptedSymmmetricKey = await createEncryptedKey(match)
  } else {
    const paymentDataForMethod = getPaymentDataByMethod(offer, selectedPaymentMethod)
    if (!paymentDataForMethod) {
      return Promise.resolve(undefined)
    }
    encryptedPaymentData = await createEncryptedPaymentData(match, paymentDataForMethod)
  }
  return {
    offerId: offer.id!,
    matchingOfferId: match.offerId,
    currency: selectedCurrency,
    paymentMethod: selectedPaymentMethod,
    symmetricKeyEncrypted: encryptedSymmmetricKey?.encrypted,
    symmetricKeySignature: encryptedSymmmetricKey?.signature,
    paymentDataEncrypted: encryptedPaymentData?.encrypted,
    paymentDataSignature: encryptedPaymentData?.signature,
    hashedPaymentData: offer.paymentData[selectedPaymentMethod]!.hash,
  }
}
