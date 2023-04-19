import i18n from '../../../utils/i18n'
import { publishSellOffer } from './publishSellOffer'

const pgpMock = jest.fn().mockResolvedValue(undefined)
const postSellOfferMock = jest.fn().mockResolvedValue([undefined, undefined])
const getOfferDetailsMock = jest.fn().mockResolvedValue([undefined])
const isSellOfferMock = jest.fn().mockReturnValue(true)
const infoMock = jest.fn()
const saveOfferMock = jest.fn()

jest.mock('../../../init/pgp', () => ({
  __esModule: true,
  default: () => pgpMock(),
}))

jest.mock('../../../utils/log', () => ({
  info: (msg: string, result: any) => infoMock(msg, result),
}))

jest.mock('../../../utils/peachAPI', () => ({
  postSellOffer: (offerDraft: any) => postSellOfferMock(offerDraft),
  getOfferDetails: (offerId: any) => getOfferDetailsMock(offerId),
}))

jest.mock('../../../utils/offer', () => ({
  isSellOffer: (offer: any) => isSellOfferMock(offer),
}))

jest.mock('../../../utils/offer', () => ({
  saveOffer: (offer: any) => saveOfferMock(offer),
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
    const { isPublished: result, navigationParams: offer, errorMessage: error } = await publishSellOffer(offerDraft)

    expect(result).toBeFalsy()
    expect(offer).toBeNull()
    expect(error).toBe(i18n('POST_OFFER_ERROR'))
  })

  it('should call info with "Posted offer" and result', async () => {
    postSellOfferMock.mockResolvedValue([{ ...offerDraft, id: 'someOfferId' } as SellOffer, undefined])
    // @ts-ignore
    await publishSellOffer(offerDraft)

    expect(infoMock).toHaveBeenCalledWith('Posted offer', { ...offerDraft, id: 'someOfferId' })
  })

  it('should call saveOffer with offerDraft and result', async () => {
    postSellOfferMock.mockResolvedValue([{ ...offerDraft, id: 'someOfferId' } as SellOffer, undefined])
    // @ts-ignore
    await publishSellOffer(offerDraft)

    expect(saveOfferMock).toHaveBeenCalledWith({ ...offerDraft, id: 'someOfferId' })
  })

  it('should return offer', async () => {
    postSellOfferMock.mockResolvedValue([{ ...offerDraft, id: 'someOfferId' } as SellOffer, undefined])
    // @ts-ignore
    const { isPublished: result, navigationParams: offer, errorMessage: error } = await publishSellOffer(offerDraft)

    expect(result).toBeTruthy()
    expect(offer).toEqual({ offerId: 'someOfferId' })
    expect(error).toBeNull()
  })
})
