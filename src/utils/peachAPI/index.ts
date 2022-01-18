import { BIP32Interface } from 'bip32'


export let accessToken: AccessToken|null
export let peachAccount: BIP32Interface|null

export const setAccessToken = (token: AccessToken) => accessToken = token
export const setPeachAccount = (acc: BIP32Interface) => peachAccount = acc

export { marketPrice } from './public/market'
export { userAuth, getAccessToken } from './private/auth'
export { postOffer, createEscrow, getFundingStatus } from './private/offer'
