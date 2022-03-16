import { getOffer } from '../../../utils/offer'
import { decrypt, verify } from '../../../utils/pgp'

export const parseContractForBuyer = async (
  updatedContract: Contract,
  response: GetContractResponse
): Promise<[Contract, Error|null]> => {
  let decryptedPaymentData: PaymentData

  // TODO consider throwing error message?
  if (!response.paymentData || !response.paymentDataSignature) return [response, null]

  try {
    const decryptedPaymentDataString = await decrypt(response.paymentData)
    decryptedPaymentData = JSON.parse(decryptedPaymentDataString)

    if (!await verify(response.paymentDataSignature, decryptedPaymentDataString, response.seller.pgpPublicKey)) {
      // TODO at this point we should probably cancel the order?
      throw new Error('Signature of payment data could not be verified')
    }
  } catch (err) {
    return [updatedContract, err as Error]
  }
  return [
    {
      ...response,
      paymentData: decryptedPaymentData
    },
    null
  ]
}

export const parseContractForSeller = async (updatedContract: Contract): Promise<[Contract, Error|null]> => {
  const sellOffer = getOffer(updatedContract.id.split('-')[0]) as SellOffer

  if (!sellOffer.paymentData) return [updatedContract, new Error('No payment data')]
  const paymentData = sellOffer.paymentData.find(data => data.type === updatedContract.paymentMethod)

  return [{ ...updatedContract, paymentData }, null]
}