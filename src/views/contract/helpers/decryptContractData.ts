import { error, info } from '../../../utils/log'
import { decryptSymmetricKey } from './decryptSymmetricKey'
import { getPaymentData } from './getPaymentData'

export const decryptContractData = async (contract: Contract) => {
  let symmetricKey = contract?.symmetricKey
  if (!symmetricKey) {
    info('No symmetric key found, decrypting')

    const [symmetricKeyResult, err] = await decryptSymmetricKey(
      contract.symmetricKeyEncrypted,
      contract.symmetricKeySignature,
      contract.buyer.pgpPublicKey,
    )

    if (err) error(err)

    if (symmetricKeyResult) {
      info('Symmetric decryption success')
      symmetricKey = symmetricKeyResult
    }
  }

  let paymentData = contract?.paymentData
  if (!paymentData && symmetricKey) {
    info('No decrypted payment data found, decrypting')

    const [paymentDataResult, getPaymentDataError] = await getPaymentData({
      ...contract,
      symmetricKey,
    })

    if (getPaymentDataError) error(getPaymentDataError)

    if (paymentDataResult) {
      info('Payment data decryption, success')
      // TODO if err is yielded consider open a dispute directly
      paymentData = paymentDataResult
    }
  }

  return {
    symmetricKey,
    paymentData,
  }
}
