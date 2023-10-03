import { publishBuyOffer } from './publishBuyOffer'

const pgpMock = jest.fn().mockResolvedValue(undefined)
jest.mock('../../../init/publishPGPPublicKey', () => ({
  publishPGPPublicKey: () => pgpMock(),
}))

const saveOfferMock = jest.fn()
jest.mock('../../../utils/offer', () => ({
  saveOffer: (...args: unknown[]) => saveOfferMock(...args),
}))

const getOfferDetailsMock = jest.fn().mockResolvedValue([{ oldOfferId: '21' } as BuyOffer])
const postBuyOfferMock = jest.fn().mockResolvedValue([{ id: '21' } as BuyOffer])
jest.mock('../../../utils/peachAPI', () => ({
  getOfferDetails: (...args: unknown[]) => getOfferDetailsMock(...args),
  postBuyOffer: (...args: unknown[]) => postBuyOfferMock(...args),
}))

describe('publishBuyOffer', () => {
  it('should call postBuyOffer', async () => {
    await publishBuyOffer({} as BuyOfferDraft)
    expect(postBuyOfferMock).toHaveBeenCalled()
  })
  it('should call saveOffer if there is a result', async () => {
    await publishBuyOffer({} as BuyOfferDraft)
    expect(saveOfferMock).toHaveBeenCalled()
  })
  it('should return true if postBuyOffer returns a result', async () => {
    const { offerId, isOfferPublished: result, errorMessage: err } = await publishBuyOffer({} as BuyOfferDraft)
    expect(offerId).toBe('21')
    expect(result).toBe(true)
    expect(err).toBe(null)
  })
  it('should return the error if it exists and there is no result', async () => {
    postBuyOfferMock.mockResolvedValueOnce([undefined, { error: 'error', details: ['details'] }])
    const { isOfferPublished: result, errorMessage: err, errorDetails } = await publishBuyOffer({} as BuyOfferDraft)
    expect(result).toBe(false)
    expect(err).toBe('error')
    expect(errorDetails).toEqual(['details'])
  })
  it('should return POST_OFFER_ERROR if there is no error and no result', async () => {
    postBuyOfferMock.mockResolvedValueOnce([undefined])
    const { isOfferPublished: result, errorMessage: err } = await publishBuyOffer({} as BuyOfferDraft)
    expect(result).toBe(false)
    expect(err).toBe('POST_OFFER_ERROR')
  })
  it('should send pgp keys and retry posting buy offer if first error is PGP_MISSING', async () => {
    postBuyOfferMock.mockResolvedValueOnce([undefined, { error: 'PGP_MISSING' }])
    const { isOfferPublished: result, errorMessage: err } = await publishBuyOffer({} as BuyOfferDraft)
    expect(pgpMock).toHaveBeenCalled()
    expect(result).toBe(true)
    expect(err).toBe(null)
  })
})
