import { useQuery } from '@tanstack/react-query'
import OpenPGP from 'react-native-fast-openpgp'
import { error } from '../../utils/log/error'
import { decrypt } from '../../utils/pgp/decrypt'
import { decryptSymmetric } from '../../utils/pgp/decryptSymmetric'
import { decryptSymmetricKey } from '../contract/helpers/decryptSymmetricKey'

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

  const paymentData = await decryptPaymentData(
    {
      paymentDataEncrypted: contract.paymentDataEncrypted,
      paymentDataSignature: contract.paymentDataSignature,
      user: contract.seller,
      paymentDataEncryptionMethod: contract.paymentDataEncryptionMethod,
    },
    symmetricKey,
  )

  return { symmetricKey, paymentData }
}

async function verifyPaymentDataSignature (
  paymentDataSignature: string,
  decryptedPaymentDataString: string,
  publicKey: string,
) {
  try {
    return await OpenPGP.verify(paymentDataSignature, decryptedPaymentDataString, publicKey)
  } catch (err) {
    return false
  }
}

type DecryptPaymentDataProps = Pick<Contract, 'paymentDataEncryptionMethod'> & {
  paymentDataEncrypted: string
  paymentDataSignature: string
  user: PublicUser
}
async function decryptPaymentData (
  { paymentDataEncrypted, paymentDataSignature, user, paymentDataEncryptionMethod }: DecryptPaymentDataProps,
  symmetricKey: string | null,
) {
  if (!paymentDataEncrypted || !paymentDataSignature) {
    error(new Error('MISSING_PAYMENT_DATA_SECRETS'))
    return null
  }
  if (paymentDataEncryptionMethod === 'asymmetric') {
    try {
      const decryptedPaymentDataString = await decrypt(paymentDataEncrypted)
      if (!verifyPaymentDataSignature(paymentDataSignature, decryptedPaymentDataString, user.pgpPublicKey)) {
        error(new Error('PAYMENT_DATA_SIGNATURE_INVALID'))
      }
      return JSON.parse(await decrypt(paymentDataEncrypted)) as PaymentData
    } catch (e) {
      error(new Error('PAYMENT_DATA_ENCRYPTION_FAILED'))
      return null
    }
  }
  if (!symmetricKey) return null

  try {
    const decryptedPaymentDataString = await decryptSymmetric(paymentDataEncrypted, symmetricKey)
    if (!verifyPaymentDataSignature(paymentDataSignature, decryptedPaymentDataString, user.pgpPublicKey)) {
      error(new Error('PAYMENT_DATA_SIGNATURE_INVALID'))
      return null
    }
    return JSON.parse(decryptedPaymentDataString) as PaymentData
  } catch (e) {
    error('SYMMETRIC_PAYMENT_DATA_ENCRYPTION_FAILED')
    return null
  }
}
