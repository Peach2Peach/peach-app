import { MatchOfferRequestBody, MatchOfferRequestParams } from '../../../../peach-api/src/@types/api/offerAPI'
import { useAccountStore } from '../../../utils/account/account'
import { getRandom } from '../../../utils/crypto'
import { isBuyOffer } from '../../../utils/offer'
import { cleanPaymentData, encryptPaymentData } from '../../../utils/paymentMethod'
import { signAndEncrypt } from '../../../utils/pgp'
import { decryptSymmetricKey } from '../../../views/contract/helpers'
import { buildPaymentDataFromHashes } from './buildPaymentDataFromHashes'
import { getMatchPrice } from './getMatchPrice'

type Props = {
  offer: BuyOffer | SellOffer
  match: Match
  currency: Currency
  paymentMethod: PaymentMethod
}
// eslint-disable-next-line max-statements
export const generateMatchOfferData = async ({ offer, match, currency, paymentMethod }: Props) => {
  const defaultOfferData: MatchOfferRequestParams & MatchOfferRequestBody = {
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
    instantTrade: match.instantTrade,
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
    const key = await decryptSymmetricKey(symmetricKeyEncrypted, symmetricKeySignature, pgpPublicKey)
    symmetricKey = key
    if (!symmetricKey) return { error: 'PAYMENTDATA_ENCRYPTION_FAILED' }
  }

  const hashes = offer.paymentData[paymentMethod]?.hashes
  if (!hashes) return { error: 'MISSING_HASHED_PAYMENT_DATA' }

  const paymentData = buildPaymentDataFromHashes(hashes, paymentMethod)
  if (!paymentData) return { error: 'MISSING_PAYMENTDATA' }

  const encryptedPaymentData = await encryptPaymentData(cleanPaymentData(paymentData), symmetricKey)
  if (!encryptedPaymentData) return { error: 'PAYMENTDATA_ENCRYPTION_FAILED' }

  return {
    result: {
      ...defaultOfferData,
      paymentDataEncrypted: encryptedPaymentData.encrypted,
      paymentDataSignature: encryptedPaymentData.signature,
    },
  }
}
