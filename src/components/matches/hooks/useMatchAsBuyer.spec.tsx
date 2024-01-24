import OpenPGP from 'react-native-fast-openpgp'
import { act, renderHook, waitFor } from 'test-utils'
import { match } from '../../../../peach-api/src/testData/match'
import { account1 } from '../../../../tests/unit/data/accountData'
import { buyOffer } from '../../../../tests/unit/data/offerData'
import { validSEPAData } from '../../../../tests/unit/data/paymentData'
import { useAccountStore } from '../../../utils/account/account'
import { peachAPI } from '../../../utils/peachAPI'
import { useMatchAsBuyer } from './useMatchAsBuyer'

jest.useFakeTimers()

describe('useMatchAsBuyer', () => {
  const currency = 'EUR'
  const signSpy = jest.spyOn(OpenPGP, 'sign')
  const encryptSpy = jest.spyOn(OpenPGP, 'encrypt')
  const encryptSymmetricSpy = jest.spyOn(OpenPGP, 'encryptSymmetric')
  const matchOfferSpy = jest.spyOn(peachAPI.private.offer, 'matchOffer')
  beforeAll(() => {
    useAccountStore.setState({ account: account1 })
  })
  it('calls match offer with the correct data', async () => {
    const signature = 'signature'
    const encrypted = 'encrypted'
    const symmetricallyEncrypted = 'symmetricallyEncrypted'
    signSpy.mockResolvedValue(signature)
    encryptSpy.mockResolvedValue(encrypted)
    encryptSymmetricSpy.mockResolvedValue(symmetricallyEncrypted)
    const { result } = renderHook(() => useMatchAsBuyer(buyOffer, match))

    act(() => {
      result.current.mutate({ selectedCurrency: currency, paymentData: validSEPAData })
    })

    await waitFor(() => {
      expect(matchOfferSpy).toHaveBeenCalledWith({
        offerId: buyOffer.id,
        matchingOfferId: match.offerId,
        price: match.prices[currency],
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
})
