import { useQuery } from '@tanstack/react-query'
import { error } from '../../utils/log/error'
import { decryptSymmetricKey } from '../contract/helpers/decryptSymmetricKey'
import { decryptPaymentData } from './decryptPaymentData'

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
  const symmetricKey = await decryptSymmetricKey(
    contract.symmetricKeyEncrypted,
    contract.symmetricKeySignature,
    contract.buyer.pgpPublicKey,
  )

  const { result: paymentData, error: decryptPaymentDataError } = await decryptPaymentData(
    {
      paymentDataEncrypted: contract.paymentDataEncrypted,
      paymentDataSignature: contract.paymentDataSignature,
      user: contract.seller,
      paymentDataEncryptionMethod: contract.paymentDataEncryptionMethod,
    },
    symmetricKey,
  )

  if (decryptPaymentDataError) error(new Error(decryptPaymentDataError))

  return { symmetricKey, paymentData }
}
