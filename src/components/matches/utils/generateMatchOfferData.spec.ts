/* eslint-disable max-lines-per-function */
import OpenPGP from 'react-native-fast-openpgp'
import { buyer } from '../../../../tests/unit/data/accountData'
import { buyOffer, sellOffer } from '../../../../tests/unit/data/offerData'
import { twintData, validCashData, validSEPAData } from '../../../../tests/unit/data/paymentData'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { generateMatchOfferData } from './generateMatchOfferData'

const randomBytes = Buffer.from('totallyRandom')
const symmetricKey = randomBytes.toString('hex')
const getRandomMock = jest.fn().mockResolvedValue(randomBytes)
jest.mock('../../../utils/crypto/getRandom', () => ({
  getRandom: () => getRandomMock(),
}))

const getPaymentMethodInfoMock = jest.fn()
jest.mock('../../../utils/paymentMethod/getPaymentMethodInfo', () => ({
  getPaymentMethodInfo: (...args: unknown[]) => getPaymentMethodInfoMock(...args),
}))

const signature = 'signature'
const encrypted = 'encrypted'
const encryptPaymentDataMock = jest.fn().mockResolvedValue({
  signature,
  encrypted,
})
jest.mock('../../../utils/paymentMethod/encryptPaymentData', () => ({
  encryptPaymentData: (...args: unknown[]) => encryptPaymentDataMock(...args),
}))

const decryptSymmetricKeyMock = jest.fn().mockResolvedValue([symmetricKey])
jest.mock('../../../views/contract/helpers', () => ({
  decryptSymmetricKey: (...args: unknown[]) => decryptSymmetricKeyMock(...args),
}))

describe('generateMatchOfferData', () => {
  const paymentData = {
    beneficiary: 'Hal Finney',
    bic: 'AAAA BB CC 123',
    iban: 'IE29 AIBK 9311 5212 3456 78',
  }
  const currency = 'EUR'
  const paymentMethod = 'sepa'
  const match = {
    matched: true,
    matchedPrice: 0,
    prices: { EUR: 200 },
    user: { pgpPublicKey: buyer.pgp.publicKey },
    premium: 0,
  } as Match
  beforeEach(() => {
    usePaymentDataStore.getState().reset()
    usePaymentDataStore.getState().addPaymentData(validSEPAData)
    usePaymentDataStore.getState().addPaymentData(twintData)
    usePaymentDataStore.getState().addPaymentData(validCashData)
  })
  it('should generate match offer data for a buy offer matching a sell offer', async () => {
    jest.spyOn(OpenPGP, 'sign').mockImplementation((message) => Promise.resolve(`${message}Signature`))
    jest.spyOn(OpenPGP, 'encrypt').mockImplementation((message) => Promise.resolve(`${message}Encrypted`))

    const { result } = await generateMatchOfferData({ offer: buyOffer, match, currency, paymentMethod })
    expect(result).toEqual({
      currency,
      matchingOfferId: undefined,
      offerId: buyOffer.id,
      paymentDataEncrypted: encrypted,
      paymentDataSignature: signature,
      paymentMethod,
      symmetricKeyEncrypted: `${symmetricKey}Encrypted`,
      symmetricKeySignature: `${symmetricKey}Signature`,
      price: match.matchedPrice,
      premium: match.premium,
    })
    expect(encryptPaymentDataMock).toHaveBeenCalledWith(paymentData, symmetricKey)
  })
  it('should generate match offer data for a sell offer double matching a buy offer', async () => {
    const { result } = await generateMatchOfferData({ offer: sellOffer, match, currency, paymentMethod })
    expect(result).toEqual({
      currency,
      matchingOfferId: undefined,
      offerId: sellOffer.id,
      paymentDataEncrypted: encrypted,
      paymentDataSignature: signature,
      paymentMethod,
      symmetricKeyEncrypted: undefined,
      symmetricKeySignature: undefined,
      price: match.matchedPrice,
      premium: match.premium,
    })
    expect(encryptPaymentDataMock).toHaveBeenCalledWith(paymentData, symmetricKey)
  })
  it('should return error if hashed payment data cannot be found', async () => {
    const { result, error } = await generateMatchOfferData({
      offer: sellOffer,
      match,
      currency,
      paymentMethod: 'nationalTransferBG',
    })
    expect(result).toEqual(undefined)
    expect(error).toEqual('MISSING_HASHED_PAYMENT_DATA')
  })
  it('should return error if partial payment data cannot be found', async () => {
    usePaymentDataStore.getState().reset()
    const { result, error } = await generateMatchOfferData({ offer: sellOffer, match, currency, paymentMethod })
    expect(result).toEqual(undefined)
    expect(error).toEqual('MISSING_PAYMENTDATA')
  })
  it('should return error if actual payment data cannot be found', async () => {
    usePaymentDataStore.setState({ paymentData: {} })
    const { result, error } = await generateMatchOfferData({ offer: sellOffer, match, currency, paymentMethod })
    expect(result).toEqual(undefined)
    expect(error).toEqual('MISSING_PAYMENTDATA')
  })
  it('should not return error for cash trades without payment data', async () => {
    const { result } = await generateMatchOfferData({
      offer: {
        ...sellOffer,
        paymentData: { [validCashData.type]: { hashes: [] } },
        meansOfPayment: { EUR: [validCashData.type] },
      },
      match,
      currency,
      paymentMethod: validCashData.type,
    })
    expect(result).toEqual({
      currency: 'EUR',
      matchingOfferId: undefined,
      offerId: '38',
      paymentDataEncrypted: 'encrypted',
      paymentDataSignature: 'signature',
      paymentMethod: validCashData.type,
      symmetricKeyEncrypted: undefined,
      symmetricKeySignature: undefined,
      price: 0,
      premium: 0,
    })
  })
  it('should return error if payment data could not be encrypted', async () => {
    encryptPaymentDataMock.mockResolvedValueOnce(undefined)

    const { result, error } = await generateMatchOfferData({ offer: sellOffer, match, currency, paymentMethod })
    expect(result).toEqual(undefined)
    expect(error).toEqual('PAYMENTDATA_ENCRYPTION_FAILED')
  })
})
