import { sellOffer } from '../../../tests/unit/data/offerData'

const accessToken: AccessToken = {
  expiry: new Date().getTime() + 1000 * 60 * 60,
  accessToken: 'token',
}

export const auth = jest.fn(async (): Promise<[AccessToken | null, APIError | null]> => [accessToken, null])

export const getOffers = jest.fn(async (): Promise<[(SellOffer | BuyOffer)[] | null, APIError | null]> => [[], null])
export const getTradingLimit = jest.fn(
  async (): Promise<[TradingLimit | null, APIError | null]> => [
    {
      daily: 1000,
      dailyAmount: 0,
      monthlyAnonymous: 1000,
      monthlyAnonymousAmount: 0,
      yearly: 100000,
      yearlyAmount: 0,
    },
    null,
  ],
)
export const getOfferDetails = jest.fn(async (): Promise<[SellOffer | null, APIError | null]> => [sellOffer, null])
export const updateUser = jest.fn(async (): Promise<[APISuccess | null, APIError | null]> => [{ success: true }, null])
export const logoutUser = jest.fn(async (): Promise<[APISuccess | null, APIError | null]> => [{ success: true }, null])
