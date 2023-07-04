import { account1, buyer } from '../../../../tests/unit/data/accountData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { setAccount } from '../../../utils/account'
import { generateMatchOfferData } from './generateMatchOfferData'

const getPaymentMethodInfoMock = jest.fn()
jest.mock('../../../utils/paymentMethod', () => ({
  getPaymentMethodInfo: (...args: any[]) => getPaymentMethodInfoMock(...args),
}))

const signature = 'signature'
const encrypted = 'encrypted'
const createEncryptedPaymentDataMock = jest.fn().mockResolvedValue({
  signature,
  encrypted,
})
jest.mock('./createEncryptedPaymentData', () => ({
  createEncryptedPaymentData: (...args: any[]) => createEncryptedPaymentDataMock(...args),
}))

describe('generateMatchOfferData', () => {
  const currency = 'EUR'
  const paymentMethod = 'sepa'
  beforeAll(() => {
    setAccount(account1)
  })
  it('should generate match offer data for a sell offer double matching a buy offer', async () => {
    const match = {
      matched: true,
      matchedPrice: 0,
      prices: {
        EUR: 200,
      },
      user: {
        pgpPublicKey: buyer.pgp.publicKey,
      },
    } as Match
    expect(await generateMatchOfferData(sellOffer, match, currency, paymentMethod)).toEqual([
      {
        currency,
        matchingOfferId: undefined,
        offerId: sellOffer.id,
        paymentDataEncrypted: encrypted,
        paymentDataSignature: signature,
        paymentMethod,
        symmetricKeyEncrypted: undefined,
        symmetricKeySignature: undefined,
      },
      null,
    ])
  })
  it('should return error if payment data could not be encrypted', async () => {
    createEncryptedPaymentDataMock.mockResolvedValueOnce(undefined)
    const match = {
      matched: true,
      matchedPrice: 0,
      prices: {
        EUR: 200,
      },
      user: {
        pgpPublicKey: buyer.pgp.publicKey,
      },
    } as Match
    expect(await generateMatchOfferData(sellOffer, match, currency, paymentMethod)).toEqual([
      null,
      'PAYMENTDATA_ENCRYPTION_FAILED',
    ])
  })
})
