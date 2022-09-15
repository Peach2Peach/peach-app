import { BIP32Interface } from 'bip32'

const accessToken: AccessToken = {
  expiry: (new Date()).getTime() + 1000 * 60 * 60,
  accessToken: 'token'
}

/**
 * @description Mock to authenticate with Peach API
 * @param keyPair key pair needed for authentication
 * @returns AccessToken or APIError
 */
export const auth = jest.fn(
  async (keyPair: BIP32Interface): Promise<[AccessToken|null, APIError|null]> =>
    [accessToken, null]
)

/**
 * @description Mock to authenticate with Peach API
 * @param keyPair key pair needed for authentication
 * @returns AccessToken or APIError
 */
export const getOffers = jest.fn(
  async (keyPair: BIP32Interface): Promise<[(SellOffer|BuyOffer)[]|null, APIError|null]> =>
    [[], null]
)