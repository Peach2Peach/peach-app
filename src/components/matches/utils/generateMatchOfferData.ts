import { useAccountStore } from '../../../utils/account/account'
import { getRandom } from '../../../utils/crypto'
import { isBuyOffer } from '../../../utils/offer'
import { cleanPaymentData, encryptPaymentData } from '../../../utils/paymentMethod'
import { MatchProps } from '../../../utils/peachAPI/private/offer/matchOffer'
import { signAndEncrypt } from '../../../utils/pgp'
import { getError, getResult } from '../../../utils/result'
import { Result } from '../../../utils/result/types'
import { decryptSymmetricKey } from '../../../views/contract/helpers'
import { buildPaymentDataFromHashes } from './buildPaymentDataFromHashes'
import { getMatchPrice } from './getMatchPrice'

type PaymentDataError = 'MISSING_HASHED_PAYMENT_DATA' | 'MISSING_PAYMENTDATA' | 'PAYMENTDATA_ENCRYPTION_FAILED'

type Props = {
  offer: BuyOffer | SellOffer
  match: Match
  currency: Currency
  paymentMethod: PaymentMethod
}
// eslint-disable-next-line max-statements
export const generateMatchOfferData = async ({
  offer,
  match,
  currency,
  paymentMethod,
}: Props): Promise<Result<MatchProps, PaymentDataError>> => {
  const defaultOfferData: MatchProps = {
    offerId: offer.id,
    matchingOfferId: match.offerId,
    price: getMatchPrice(match, paymentMethod, currency),
    premium: match.premium,
    currency,
    paymentMethod,
    symmetricKeyEncrypted: undefined,
    symmetricKeySignature: undefined,
    paymentDataEncrypted: undefined,
    paymentDataSignature: undefined,
  }

  const { symmetricKeyEncrypted, symmetricKeySignature } = match
  let pgpPublicKey = match.user.pgpPublicKey
  let symmetricKey

  if (isBuyOffer(offer)) {
    const key = (await getRandom(256)).toString('hex')
    const account = useAccountStore.getState().account
    const { encrypted, signature } = await signAndEncrypt(
      key,
      [account.pgp.publicKey, match.user.pgpPublicKey].join('\n'),
    )
    defaultOfferData.symmetricKeyEncrypted = encrypted
    defaultOfferData.symmetricKeySignature = signature
    pgpPublicKey = account.pgp.publicKey
    symmetricKey = key
  } else {
    const [key] = await decryptSymmetricKey(symmetricKeyEncrypted, symmetricKeySignature, pgpPublicKey)
    symmetricKey = key
    if (!symmetricKey) return getError('PAYMENTDATA_ENCRYPTION_FAILED')
  }

  const hashes = offer.paymentData[paymentMethod]?.hashes
  if (!hashes) return getError('MISSING_HASHED_PAYMENT_DATA')

  const paymentData = buildPaymentDataFromHashes(hashes, paymentMethod)
  if (!paymentData) return getError('MISSING_PAYMENTDATA')

  const encryptedPaymentData = await encryptPaymentData(cleanPaymentData(paymentData), symmetricKey)
  if (!encryptedPaymentData) return getError('PAYMENTDATA_ENCRYPTION_FAILED')

  return getResult({
    ...defaultOfferData,
    paymentDataEncrypted: encryptedPaymentData.encrypted,
    paymentDataSignature: encryptedPaymentData.signature,
  })
}
