import { API_URL, HTTP_AUTH_PASS, HTTP_AUTH_USER } from '@env'
import { BIP32Interface } from 'bip32'
import * as bitcoin from 'bitcoinjs-lib'

let accessToken: AccessToken|null

/**
 * @description Method to authenticate with Peach API
 * @param keyPair key pair needed for authentication
 * @returns AccessToken or APIError
 */
export const userAuth = async (keyPair: BIP32Interface): Promise<AccessToken|APIError> => {
  const message = 'Peach Registration ' + (new Date()).getTime()

  try {
    const response = await fetch(`${API_URL}/v1/user/auth/`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${HTTP_AUTH_USER}:${HTTP_AUTH_PASS}`).toString('base64'),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        publicKey: keyPair.publicKey.toString('hex'),
        message,
        signature: keyPair.sign(bitcoin.crypto.sha256(Buffer.from(message))).toString('hex')
      })
    })
    accessToken = await response.json() as AccessToken

    return accessToken
  } catch (e) {
    let error = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      error = e.toUpperCase()
    } else if (e instanceof Error) {
      error = e.message
    }

    return { error } as APIError
  }
}

export const marketPrice = async (currency: Currency): Promise<PeachPairInfo|APIError> => {
  const response = await fetch(`${API_URL}/v1/market/price/BTC${currency}`, {
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${HTTP_AUTH_USER}:${HTTP_AUTH_PASS}`).toString('base64')
    }
  })

  try {
    return await response.json() as PeachPairInfo
  } catch (e) {
    let error = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      error = e.toUpperCase()
    } else if (e instanceof Error) {
      error = e.message
    }

    return { error } as APIError
  }
}