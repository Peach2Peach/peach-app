/* eslint-disable max-lines-per-function */
import { buyer } from '../../../../tests/unit/data/accountData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { twintData, validCashData, validSEPAData } from '../../../../tests/unit/data/paymentData'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { generateMatchOfferData } from './generateMatchOfferData'

const getPaymentMethodInfoMock = jest.fn()
jest.mock('../../../utils/paymentMethod/getPaymentMethodInfo', () => ({
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
    premium: 0,
  } as Match
  beforeEach(() => {
    usePaymentDataStore.getState().reset()
    usePaymentDataStore.getState().addPaymentData(validSEPAData)
    usePaymentDataStore.getState().addPaymentData(twintData)
    usePaymentDataStore.getState().addPaymentData(validCashData)
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
        premium: match.premium,
        price: match.matchedPrice,
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
  it('should return error if partial payment data cannot be found', async () => {
    usePaymentDataStore.getState().reset()
    expect(await generateMatchOfferData(sellOffer, match, currency, paymentMethod)).toEqual([
      null,
      'MISSING_PAYMENTDATA',
    ])
  })
  it('should return error if actual payment data cannot be found', async () => {
    usePaymentDataStore.setState({ paymentData: {} })
    expect(await generateMatchOfferData(sellOffer, match, currency, paymentMethod)).toEqual([
      null,
      'MISSING_PAYMENTDATA',
    ])
  })
  it('should not return error for cash trades without payment data', async () => {
    expect(
      await generateMatchOfferData(
        {
          ...sellOffer,
          paymentData: { [validCashData.type]: { hashes: [] } },
          meansOfPayment: { EUR: [validCashData.type] },
        },
        match,
        currency,
        validCashData.type,
      ),
    ).toEqual([
      {
        currency: 'EUR',
        matchingOfferId: undefined,
        offerId: '38',
        paymentDataEncrypted: 'encrypted',
        paymentDataSignature: 'signature',
        paymentMethod: validCashData.type,
        symmetricKeyEncrypted: undefined,
        symmetricKeySignature: undefined,
        premium: 0,
        price: 0,
      },
      null,
    ])
  })
  it('should return error if payment data could not be encrypted', async () => {
    createEncryptedPaymentDataMock.mockResolvedValueOnce(undefined)

    expect(await generateMatchOfferData(sellOffer, match, currency, paymentMethod)).toEqual([
      null,
      'PAYMENTDATA_ENCRYPTION_FAILED',
    ])
  })
})
