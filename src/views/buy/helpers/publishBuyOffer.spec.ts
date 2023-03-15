import { publishBuyOffer } from './publishBuyOffer'

const pgpMock = jest.fn().mockResolvedValue(undefined)
jest.mock('../../../init/pgp', () => ({
  __esModule: true,
  default: (...args: any[]) => pgpMock(...args),
}))

const saveOfferMock = jest.fn()
jest.mock('../../../utils/offer', () => ({
  saveOffer: (...args: any[]) => saveOfferMock(...args),
}))

const getOfferDetailsMock = jest.fn().mockResolvedValue([{ oldOfferId: '21' } as BuyOffer])
// @ts-expect-error
const postBuyOfferMock = jest.fn().mockResolvedValue([{ offerId: '21' } as BuyOffer])
jest.mock('../../../utils/peachAPI', () => ({
  getOfferDetails: (...args: any[]) => getOfferDetailsMock(...args),
  postBuyOffer: (...args: any[]) => postBuyOfferMock(...args),
}))

const getAndUpdateTradingLimitMock = jest.fn()
jest.mock('../../../views/buy/helpers/getAndUpdateTradingLimit', () => ({
  getAndUpdateTradingLimit: (...args: any[]) => getAndUpdateTradingLimitMock(...args),
}))

describe('publishBuyOffer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should call pgp', async () => {
    await publishBuyOffer({} as BuyOfferDraft)
    expect(pgpMock).toHaveBeenCalled()
  })
  it('should call postBuyOffer', async () => {
    await publishBuyOffer({} as BuyOfferDraft)
    expect(postBuyOfferMock).toHaveBeenCalled()
  })
  it('should call getAndUpdateTradingLimit if there is a result', async () => {
    await publishBuyOffer({} as BuyOfferDraft)
    expect(getAndUpdateTradingLimitMock).toHaveBeenCalled()
  })
  it('should call saveOffer if there is a result', async () => {
    await publishBuyOffer({} as BuyOfferDraft)
    expect(saveOfferMock).toHaveBeenCalled()
  })
  it('should return true if postBuyOffer returns a result', async () => {
    postBuyOfferMock.mockResolvedValueOnce([{} as BuyOffer])
    const { isOfferPublished: result, errorMessage: err } = await publishBuyOffer({} as BuyOfferDraft)
    expect(result).toBe(true)
    expect(err).toBe(null)
  })
  it('should return the error if it exists and there is no result', async () => {
    postBuyOfferMock.mockResolvedValueOnce([undefined, { error: 'error' }])
    const { isOfferPublished: result, errorMessage: err } = await publishBuyOffer({} as BuyOfferDraft)
    expect(result).toBe(false)
    expect(err).toBe('error')
  })
  it('should return POST_OFFER_ERROR if there is no error and no result', async () => {
    postBuyOfferMock.mockResolvedValueOnce([undefined])
    const { isOfferPublished: result, errorMessage: err } = await publishBuyOffer({} as BuyOfferDraft)
    expect(result).toBe(false)
    expect(err).toBe('POST_OFFER_ERROR')
  })
})
