/* eslint-disable max-lines-per-function */
import { account1, buyer } from '../../../../tests/unit/data/accountData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { paymentDetailInfo } from '../../../../tests/unit/data/paymentData'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
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
  beforeAll(() => {
    setAccount(account1)
    usePaymentDataStore.setState({ paymentDetailInfo })
  })
  it('should generate match offer data for a sell offer double matching a buy offer', async () => {
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
    expect(createEncryptedPaymentDataMock).toHaveBeenCalledWith(match, {
      beneficiary: 'Hal Finney',
      bic: 'AAAA BB CC 123',
      iban: 'IE29 AIBK 9311 5212 3456 78',
    })
  })
  it('should return error if hashed payment data cannot be found', async () => {
    expect(await generateMatchOfferData(sellOffer, match, currency, 'nationalTransferCY')).toEqual([
      null,
      'MISSING_HASHED_PAYMENT_DATA',
    ])
  })
  it('should return error if payment data cannot be found', async () => {
    usePaymentDataStore.setState({ paymentDetailInfo: {} })

    expect(await generateMatchOfferData(sellOffer, match, currency, paymentMethod)).toEqual([
      null,
      'MISSING_PAYMENTDATA',
    ])
  })
  it('should not return error for cash trades without payment data', async () => {
    usePaymentDataStore.setState({ paymentDetailInfo: {} })

    expect(
      await generateMatchOfferData(
        { ...sellOffer, paymentData: { 'cash.de.123': { hashes: [] } }, meansOfPayment: { EUR: ['cash.de.123'] } },
        match,
        currency,
        'cash.de.123',
      ),
    ).toEqual([
      {
        currency: 'EUR',
        matchingOfferId: undefined,
        offerId: '38',
        paymentDataEncrypted: 'encrypted',
        paymentDataSignature: 'signature',
        paymentMethod: 'cash.de.123',
        symmetricKeyEncrypted: undefined,
        symmetricKeySignature: undefined,
      },
      null,
    ])
  })
  it('should return error if payment data could not be encrypted', async () => {
    usePaymentDataStore.setState({ paymentDetailInfo })
    createEncryptedPaymentDataMock.mockResolvedValueOnce(undefined)

    expect(await generateMatchOfferData(sellOffer, match, currency, paymentMethod)).toEqual([
      null,
      'PAYMENTDATA_ENCRYPTION_FAILED',
    ])
  })
})
