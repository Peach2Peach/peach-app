import { error, info } from '../log'
import { decryptSymmetricKey } from '../../views/contract/helpers/decryptSymmetricKey'
import { getPaymentData } from '../../views/contract/helpers/getPaymentData'

export const decryptContractData = async (contract: Contract) => {
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

  const [paymentData, getPaymentDataError] = await getPaymentData({
    ...contract,
    symmetricKey,
  })

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
