import { getOffer } from '../../../utils/offer'
import { decrypt, verify } from '../../../utils/pgp'

export const getPaymentDataBuyer = async (contract: Contract): Promise<[PaymentData|null, Error|null]> => {
  let decryptedPaymentData: PaymentData|null = null

  if (contract.paymentData) return [contract.paymentData, null]
  // TODO consider throwing error message?
  if (!contract.paymentDataEncrypted || !contract.paymentDataSignature) return [null, null]

  const decryptedPaymentDataString = await decrypt(contract.paymentDataEncrypted)
  try {
    decryptedPaymentData = JSON.parse(decryptedPaymentDataString)
  } catch (e) {
    return [decryptedPaymentData, new Error('INVALID_PAYMENTDATA')]
  }
  try {
    if (!await verify(contract.paymentDataSignature, decryptedPaymentDataString, contract.seller.pgpPublicKey)) {
      // TODO at this point we should probably cancel the order?
      // problem how can buyer app proof that the payment data is indeed wrong?
      return [decryptedPaymentData, new Error('INVALID_SIGNATURE')]
    }
  } catch (err) {
    return [decryptedPaymentData, new Error('INVALID_SIGNATURE')]
  }
  return [decryptedPaymentData, null]
}

export const getPaymentDataSeller = async (contract: Contract): Promise<[PaymentData|null, Error|null]> => {
  const sellOffer = getOffer(contract.id.split('-')[0]) as SellOffer

  if (!sellOffer.paymentData) return [null, new Error('No payment data')]
  const paymentData = sellOffer.paymentData.find(data => data.type === contract.paymentMethod)
  return [paymentData || null, null]
}