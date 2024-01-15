import OpenPGP from 'react-native-fast-openpgp'
import { Match } from '../../../../peach-api/src/@types/match'
import { account1, seller } from '../../../../tests/unit/data/accountData'
import { buyOffer } from '../../../../tests/unit/data/offerData'
import { validSEPAData } from '../../../../tests/unit/data/paymentData'
import { useAccountStore } from '../../../utils/account/account'
import { generateMatchOfferData } from './useMatchAsBuyer'

describe('generateMatchOfferData', () => {
  const currency = 'EUR'
  const match: Match = {
    // @ts-expect-error publicUser is a subset of User
    user: seller,
    offerId: '2',
    amount: 10000,
    escrow: 'escrow',
    prices: { EUR: 100 },
    premium: 4,
    meansOfPayment: { EUR: ['sepa'] },
    matched: false,
    unavailable: { exceedsLimit: [] },
    instantTrade: false,
  }
  const signSpy = jest.spyOn(OpenPGP, 'sign')
  const encryptSpy = jest.spyOn(OpenPGP, 'encrypt')
  const encryptSymmetricSpy = jest.spyOn(OpenPGP, 'encryptSymmetric')
  beforeEach(() => {
    useAccountStore.getState().setAccount(account1)
  })
  it('generates required data to match sell offer', async () => {
    const signature = 'signature'
    const encrypted = 'encrypted'
    const symmetricallyEncrypted = 'symmetricallyEncrypted'
    signSpy.mockResolvedValue(signature)
    encryptSpy.mockResolvedValue(encrypted)
    encryptSymmetricSpy.mockResolvedValue(symmetricallyEncrypted)
    const { result } = await generateMatchOfferData({
      offer: buyOffer,
      match,
      currency,
      paymentData: validSEPAData,
      publicKey: account1.pgp.publicKey,
    })
    expect(result).toEqual({
      offerId: buyOffer.id,
      matchingOfferId: match.offerId,
      price: 100,
      premium: match.premium,
      currency,
      paymentMethod: validSEPAData.type,
      paymentData: {
        sepa: {
          country: undefined,
          hashes: ['8b703de3cb4f30887310c0f6fcaa35d58be484207ebffec12be69ec9b1d0b5f3'],
        },
      },
      instantTrade: match.instantTrade,
      symmetricKeyEncrypted: encrypted,
      symmetricKeySignature: signature,
      paymentDataEncrypted: symmetricallyEncrypted,
      paymentDataSignature: signature,
    })
  })
})
