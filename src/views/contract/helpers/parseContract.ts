import { getOffer } from '../../../utils/offer'
import { decrypt, verify } from '../../../utils/pgp'

export const getPaymentDataBuyer = async (contract: Contract): Promise<[PaymentData|null, Error|null]> => {
  let decryptedPaymentData: PaymentData

  if (contract.paymentData) return [contract.paymentData, null]
  // TODO consider throwing error message?
  if (!contract.paymentDataEncrypted || !contract.paymentDataSignature) return [null, null]

  try {
    const decryptedPaymentDataString = await decrypt(contract.paymentDataEncrypted)
    decryptedPaymentData = JSON.parse(decryptedPaymentDataString)

    if (!await verify(contract.paymentDataSignature, decryptedPaymentDataString, contract.seller.pgpPublicKey)) {
      // TODO at this point we should probably cancel the order?
      throw new Error('Signature of payment data could not be verified')
    }
  } catch (err) {
    return [null, err as Error]
  }
  return [decryptedPaymentData, null]
}

export const getPaymentDataSeller = async (contract: Contract): Promise<[PaymentData|null, Error|null]> => {
  const sellOffer = getOffer(contract.id.split('-')[0]) as SellOffer

  if (!sellOffer.paymentData) return [null, new Error('No payment data')]
  const paymentData = sellOffer.paymentData.find(data => data.type === contract.paymentMethod)

  return [paymentData || null, null]
}