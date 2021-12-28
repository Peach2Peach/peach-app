import { HTTP_AUTH_PASS, HTTP_AUTH_USER } from '@env'
import { BIP32Interface } from 'bip32'

export const Authorization = 'Basic ' + Buffer.from(`${HTTP_AUTH_USER}:${HTTP_AUTH_PASS}`).toString('base64')

export let accessToken: AccessToken|null
export let account: BIP32Interface|null

export const setAccessToken = (token: AccessToken) => accessToken = token
export const setAccount = (acc: BIP32Interface) => account = acc

export { marketPrice } from './public/market'
export { userAuth, getAccessToken } from './private/auth'
export { postOffer, createEscrow, getFundingStatus } from './private/offer'
