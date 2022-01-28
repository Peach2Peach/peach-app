import { BIP32Interface } from 'bip32'

const accessToken: AccessToken = {
  expiry: (new Date()).getTime() + 1000 * 60 * 60,
  accessToken: 'token'
}

/**
 * @description Method to authenticate with Peach API
 * @param keyPair key pair needed for authentication
 * @returns AccessToken or APIError
 */
export const userAuth = async (keyPair: BIP32Interface): Promise<[AccessToken|null, APIError|null]> =>
  [accessToken, null]