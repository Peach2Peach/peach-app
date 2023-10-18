import { useQuery } from '@tanstack/react-query'
import { error, info } from '../../utils/log'
import { decryptSymmetric, verify } from '../../utils/pgp'
import { decryptSymmetricKey } from '../contract/helpers'

export const useDecryptedContractData = (contract?: Contract) =>
  useQuery({
    queryKey: ['contract', contract?.id, 'decrytedData'],
    queryFn: async () => {
      if (!contract) throw new Error('No contract provided')
      const { symmetricKey, paymentData } = await decryptContractData(contract)

      if (!symmetricKey || !paymentData) throw new Error('Could not decrypt contract data')

      return { symmetricKey, paymentData }
    },
    enabled: !!contract,
  })

async function decryptContractData (contract: Contract) {
  info('decryptContractData - decrypting symmetric key')

  const [symmetricKey, err] = await decryptSymmetricKey(
    contract.symmetricKeyEncrypted,
    contract.symmetricKeySignature,
    contract.buyer.pgpPublicKey,
  )

  if (!symmetricKey || err) {
    error(err)
    return {
      symmetricKey,
      paymentData: null,
    }
  }
  info('Symmetric decryption success')
  info('decryptContractData - decrypting payment data')

  const [paymentData, getPaymentDataError] = await getPaymentData(contract, symmetricKey)

  if (paymentData) {
    info('Payment data decryption, success')
  } else {
    error(getPaymentDataError)
  }

  return {
    symmetricKey,
    paymentData,
  }
}

async function getPaymentData (contract: Contract, symmetricKey: string) {
  const { paymentDataEncrypted, paymentDataSignature, seller } = contract

  if (!paymentDataEncrypted || !paymentDataSignature) return [null, new Error('MISSING_PAYMENTDATA')] as const

  let decryptedPaymentData: PaymentData | null = null
  let decryptedPaymentDataString
  try {
    decryptedPaymentDataString = await decryptSymmetric(paymentDataEncrypted, symmetricKey)
    decryptedPaymentData = JSON.parse(decryptedPaymentDataString)
  } catch (e) {
    return [decryptedPaymentData, new Error('INVALID_PAYMENTDATA')] as const
  }
  try {
    if (!(await verify(paymentDataSignature, decryptedPaymentDataString, seller.pgpPublicKey))) {
      return [decryptedPaymentData, new Error('INVALID_SIGNATURE')] as const
    }
  } catch (err) {
    return [decryptedPaymentData, new Error('INVALID_SIGNATURE')] as const
  }

  return [decryptedPaymentData, null] as const
}
