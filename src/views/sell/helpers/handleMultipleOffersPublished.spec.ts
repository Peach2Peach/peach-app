import { Address } from 'bdk-rn'
import { account1 } from '../../../../tests/unit/data/accountData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { validSEPAData } from '../../../../tests/unit/data/paymentData'
import { walletGetInternalAddressMock } from '../../../../tests/unit/mocks/bdkRN'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { createWalletFromSeedPhrase, getNetwork } from '../../../utils/wallet'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { handleMultipleOffersPublished } from './handleMultipleOffersPublished'

const saveOfferMock = jest.fn()
jest.mock('../../../utils/offer', () => ({
  saveOffer: (offer: unknown) => saveOfferMock(offer),
}))

describe('handleMultipleOffersPublished', () => {
  const offerDraft: SellOfferDraft = {
    ...sellOffer,
    originalPaymentData: [validSEPAData],
  }
  const sellOffer2 = { ...sellOffer, id: '39' }
  const sellOffer3 = { ...sellOffer, id: '40' }
  const { wallet } = createWalletFromSeedPhrase(account1.mnemonic, getNetwork())
  setPeachWallet(new PeachWallet({ wallet }))

  beforeAll(async () => {
    await peachWallet.loadWallet()

    const address = 'address'
    const addressObject = new Address()
    addressObject.asString = jest.fn().mockResolvedValue(address)
    const index = 4
    walletGetInternalAddressMock.mockResolvedValue({ address: addressObject, index })
  })
  it('should call saveOffer with offerDraft and results', async () => {
    await handleMultipleOffersPublished([sellOffer, sellOffer2, sellOffer3], offerDraft)

    expect(saveOfferMock).toHaveBeenCalledWith({ ...offerDraft, ...sellOffer })
    expect(saveOfferMock).toHaveBeenCalledWith({ ...offerDraft, ...sellOffer2 })
    expect(saveOfferMock).toHaveBeenCalledWith({ ...offerDraft, ...sellOffer3 })
  })

  it('should return publishing result data', async () => {
    const {
      isPublished: result,
      navigationParams: offer,
      errorMessage: error,
    } = await handleMultipleOffersPublished([sellOffer, sellOffer2, sellOffer3], offerDraft)

    expect(result).toBeTruthy()
    expect(offer).toEqual({ offerId: sellOffer.id })
    expect(error).toBeNull()
  })

  it('should reset fund multiple setting', async () => {
    useOfferPreferences.getState().setMulti(3)
    await handleMultipleOffersPublished([sellOffer, sellOffer2, sellOffer3], offerDraft)

    expect(useOfferPreferences.getState().multi).toBeUndefined()
  })
  it('should register offer ids for funding multiple escrows', async () => {
    await handleMultipleOffersPublished([sellOffer, sellOffer2, sellOffer3], offerDraft)

    expect(useWalletState.getState().fundMultipleMap).toEqual({
      bcrt1qwype5wug33a6hwz9u2n6vz4lc0kpw0kg4xc8fq: ['38', '39', '40'],
    })
  })
})
