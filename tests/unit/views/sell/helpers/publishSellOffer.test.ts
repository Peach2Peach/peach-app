import i18n from '../../../../../src/utils/i18n'
import { publishSellOffer } from '../../../../../src/views/sell/helpers/publishSellOffer'

const pgpMock = jest.fn().mockResolvedValue(undefined)
const postSellOfferMock = jest.fn().mockResolvedValue([undefined, undefined])
const getOfferDetailsMock = jest.fn().mockResolvedValue([undefined])
const getAndUpdateTradingLimitMock = jest.fn().mockResolvedValue(undefined)
const isSellOfferMock = jest.fn().mockReturnValue(true)
const infoMock = jest.fn()

jest.mock('../../../../../src/init/pgp', () => ({
  __esModule: true,
  default: () => pgpMock(),
}))

jest.mock('../../../../../src/utils/log', () => ({
  info: (msg: string, result: any) => infoMock(msg, result),
}))

jest.mock('../../../../../src/utils/peachAPI', () => ({
  postSellOffer: (offerDraft: any) => postSellOfferMock(offerDraft),
  getOfferDetails: (offerId: any) => getOfferDetailsMock(offerId),
}))

jest.mock('../../../../../src/utils/offer', () => ({
  isSellOffer: (offer: any) => isSellOfferMock(offer),
}))

jest.mock('../../../../../src/views/buy/helpers/getAndUpdateTradingLimit', () => ({
  getAndUpdateTradingLimit: () => getAndUpdateTradingLimitMock(),
}))

// eslint-disable-next-line max-lines-per-function
describe('publishSellOffer', () => {
  const offerDraft = {
    type: 'ask',
    amount: 0.0001,
    premium: 0.05,
    meansOfPayment: { EUR: ['sepa'] },
    paymentData: { sepa: { hash: 'someHash' } },
    returnAddress: '1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call info with "Posting offer " and offerDraft', async () => {
    // @ts-ignore
    await publishSellOffer(offerDraft)

    expect(infoMock).toHaveBeenCalledWith('Posting offer ', JSON.stringify(offerDraft))
  })

  it('should call pgp', async () => {
    // @ts-ignore
    await publishSellOffer(offerDraft)

    expect(pgpMock).toHaveBeenCalled()
  })

  it('should call postSellOffer with offerDraft', async () => {
    // @ts-ignore
    await publishSellOffer(offerDraft)

    expect(postSellOfferMock).toHaveBeenCalledWith(offerDraft)
  })

  test('if there is no result from postSellOffer it should return an errorMessage', async () => {
    postSellOfferMock.mockResolvedValue([undefined])
    // @ts-ignore
    const [result, offer, error] = await publishSellOffer(offerDraft)

    expect(result).toBeFalsy()
    expect(offer).toBeNull()
    expect(error).toBe(i18n('POST_OFFER_ERROR'))
  })

  it('should call info with "Posted offer" and result', async () => {
    postSellOfferMock.mockResolvedValue([{ offerId: 'someOfferId' }, undefined])
    getOfferDetailsMock.mockResolvedValue([{ ...offerDraft, id: 'someOfferId' }])
    // @ts-ignore
    await publishSellOffer(offerDraft)

    expect(infoMock).toHaveBeenCalledWith('Posted offer', { offerId: 'someOfferId' })
  })

  it('should call getAndUpdateTradingLimit', async () => {
    postSellOfferMock.mockResolvedValue([{ offerId: 'someOfferId' }, undefined])
    // @ts-ignore
    await publishSellOffer(offerDraft)

    expect(getAndUpdateTradingLimitMock).toHaveBeenCalled()
  })

  it('should call getOfferDetails with offerId', async () => {
    postSellOfferMock.mockResolvedValue([{ offerId: 'someOfferId' }, undefined])
    // @ts-ignore
    await publishSellOffer(offerDraft)

    expect(getOfferDetailsMock).toHaveBeenCalledWith({ offerId: 'someOfferId' })
  })

  it('should return offer if it is a sell offer', async () => {
    postSellOfferMock.mockResolvedValue([{ offerId: 'someOfferId' }, undefined])
    getOfferDetailsMock.mockResolvedValue([{ ...offerDraft, id: 'someOfferId' }])
    isSellOfferMock.mockReturnValue(true)
    // @ts-ignore
    const [result, offer, error] = await publishSellOffer(offerDraft)

    expect(result).toBeTruthy()
    expect(offer).toEqual({ offer: { ...offerDraft, id: 'someOfferId' } })
    expect(error).toBeNull()
  })

  it('should return the offerdraft with an id as a default', async () => {
    postSellOfferMock.mockResolvedValue([{ offerId: 'someOfferId' }, undefined])
    getOfferDetailsMock.mockResolvedValue([undefined])
    isSellOfferMock.mockReturnValue(true)
    // @ts-ignore
    const [result, offer, error] = await publishSellOffer(offerDraft)

    expect(result).toBeTruthy()
    expect(offer).toEqual({ offer: { ...offerDraft, id: 'someOfferId' } })
    expect(error).toBeNull()

    getOfferDetailsMock.mockResolvedValue([{ ...offerDraft, id: 'someOfferId' }])
    isSellOfferMock.mockReturnValue(false)
    // @ts-ignore
    const [result2, offer2, error2] = await publishSellOffer(offerDraft)

    expect(result2).toBeTruthy()
    expect(offer2).toEqual({ offer: { ...offerDraft, id: 'someOfferId' } })
    expect(error2).toBeNull()
  })
})
