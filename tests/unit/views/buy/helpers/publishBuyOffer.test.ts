import { publishBuyOffer } from '../../../../../src/views/buy/helpers/publishBuyOffer'

const pgpMock = jest.fn().mockResolvedValue(undefined)
jest.mock('../../../../../src/init/pgp', () => ({
  __esModule: true,
  default: (...args: any[]) => pgpMock(...args),
}))

const saveOfferMock = jest.fn()
jest.mock('../../../../../src/utils/offer', () => ({
  saveOffer: (...args: any[]) => saveOfferMock(...args),
}))

const getOfferDetailsMock = jest.fn().mockResolvedValue([{ oldOfferId: '21' } as BuyOffer])
// @ts-expect-error
const postBuyOfferMock = jest.fn().mockResolvedValue([{ offerId: '21' } as BuyOffer])
jest.mock('../../../../../src/utils/peachAPI', () => ({
  getOfferDetails: (...args: any[]) => getOfferDetailsMock(...args),
  postBuyOffer: (...args: any[]) => postBuyOfferMock(...args),
}))

const getAndUpdateTradingLimitMock = jest.fn()
jest.mock('../../../../../src/views/buy/helpers/getAndUpdateTradingLimit', () => ({
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
  it('should call getAndUpdateTradingLimit if there is no error', async () => {
    await publishBuyOffer({} as BuyOfferDraft)
    expect(getAndUpdateTradingLimitMock).toHaveBeenCalled()
  })
  it('should call getOfferDetails with the id from the result', async () => {
    await publishBuyOffer({} as BuyOfferDraft)
    expect(getOfferDetailsMock).toHaveBeenCalledWith({ offerId: '21' })
  })
  it('should not call getOfferDetails if there is no result', async () => {
    postBuyOfferMock.mockResolvedValueOnce([undefined, { error: 'error' }])
    await publishBuyOffer({} as BuyOfferDraft)
    expect(getOfferDetailsMock).not.toHaveBeenCalled()
  })
  it('should call saveOffer if the offer exists', async () => {
    await publishBuyOffer({} as BuyOfferDraft)
    expect(saveOfferMock).toHaveBeenCalled()
  })
  it('should not call saveOffer if the offer doesn\'t exist', async () => {
    getOfferDetailsMock.mockResolvedValueOnce([undefined])
    await publishBuyOffer({} as BuyOfferDraft)
    expect(saveOfferMock).not.toHaveBeenCalled()
  })
  it('should return [true, null] if postBuyOffer returns a result', async () => {
    postBuyOfferMock.mockResolvedValueOnce([{} as BuyOffer])
    const [result, err] = await publishBuyOffer({} as BuyOfferDraft)
    expect(result).toBe(true)
    expect(err).toBe(null)
  })
  it('should return the error if it exists and there is no result', async () => {
    postBuyOfferMock.mockResolvedValueOnce([undefined, { error: 'error' }])
    const [result, err] = await publishBuyOffer({} as BuyOfferDraft)
    expect(result).toBe(false)
    expect(err).toBe('error')
  })
  it('should return POST_OFFER_ERROR if there is no error and no result', async () => {
    postBuyOfferMock.mockResolvedValueOnce([undefined])
    const [result, err] = await publishBuyOffer({} as BuyOfferDraft)
    expect(result).toBe(false)
    expect(err).toBe('POST_OFFER_ERROR')
  })
})
