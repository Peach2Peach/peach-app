import { API_URL } from '@env'
import { BIP32Interface } from 'bip32'
import * as bitcoin from 'bitcoinjs-lib'
import { accessToken, peachAccount, setAccessToken, setPeachAccount } from '..'
import { error, info } from '../../logUtils'

/**
 * @description Method to authenticate with Peach API
 * @param keyPair key pair needed for authentication
 * @returns AccessToken or APIError
 */
export const userAuth = async (keyPair: BIP32Interface): Promise<[AccessToken|null, APIError|null]> => {
  const message = 'Peach Registration ' + (new Date()).getTime()

  setPeachAccount(keyPair)

  try {
    const response = await fetch(`${API_URL}/v1/user/auth/`, {
      headers: {
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

    const token = await response.json() as AccessToken
    setAccessToken(token)

    info('peachAPI - userAuth - SUCCESS', keyPair.publicKey.toString('hex'), token)

    return [token, null]
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }

    error('peachAPI - userAuth', e)

    return [null, { error: err }]
  }
}

/**
 * @description Method to get and return access token
 * @returns Access Token
 */
export const getAccessToken = async (): Promise<string> => {
  if (accessToken && accessToken.expiry > (new Date()).getTime()) {
    console.log(accessToken.expiry, (new Date()).getTime(), accessToken.expiry > (new Date()).getTime())
    return 'Basic ' + Buffer.from(accessToken.accessToken)
  }

  const [result, err] = await userAuth(peachAccount as BIP32Interface)

  if (!result || err) {
    error('peachAPI - getAccessToken', err)

    return ''
  }

  return 'Basic ' + Buffer.from(result.accessToken)
}