import { useQuery } from '@tanstack/react-query'
import OpenPGP from 'react-native-fast-openpgp'
import { useConfigStore } from '../../store/configStore/configStore'
import { decrypt } from '../../utils/pgp/decrypt'
import { decryptSymmetric } from '../../utils/pgp/decryptSymmetric'
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

type DecryptPaymentDataProps = Pick<Contract, 'paymentDataEncryptionMethod'> & {
  paymentDataEncrypted: string
  paymentDataSignature: string
  user: PublicUser
}
async function decryptPaymentData (
  { paymentDataEncrypted, paymentDataSignature, user, paymentDataEncryptionMethod }: DecryptPaymentDataProps,
  symmetricKey: string | null,
) {
  if (!paymentDataEncrypted || !paymentDataSignature) return null
  if (paymentDataEncryptionMethod === 'asymmetric') {
    const peachPGPPublicKey = useConfigStore.getState().peachPGPPublicKey
    if (!peachPGPPublicKey) return null
    try {
      const decryptedPaymentData = JSON.parse(await decrypt(paymentDataEncrypted)) as PaymentData
      return decryptedPaymentData
    } catch (e) {
      return null
    }
  }
  if (!symmetricKey) return null

  let decryptedPaymentData: PaymentData | null = null
  let decryptedPaymentDataString
  try {
    decryptedPaymentDataString = await decryptSymmetric(paymentDataEncrypted, symmetricKey)
    decryptedPaymentData = JSON.parse(decryptedPaymentDataString)
  } catch (e) {
    return decryptedPaymentData
  }
  try {
    if (!(await OpenPGP.verify(paymentDataSignature, decryptedPaymentDataString, user.pgpPublicKey))) {
      return decryptedPaymentData
    }
  } catch (err) {
    return decryptedPaymentData
  }

  return decryptedPaymentData
}
