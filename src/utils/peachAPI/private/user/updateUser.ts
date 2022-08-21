import { API_URL } from '@env'
import * as bitcoin from 'bitcoinjs-lib'
import OpenPGP from 'react-native-fast-openpgp'
import fetch from '../../../fetch'
import { parseResponse, peachAccount } from '../..'
import { getAccessToken } from './getAccessToken'

type PGPPayload = {
  publicKey: string
  pgpPublicKey: string
  signature: string
  message: string
  pgpSignature: string
}

const getPGPUpdatePayload = async (pgp?: PGPKeychain): Promise<{}|PGPPayload> => {
  if (!peachAccount || !pgp) return {}

  const message = 'Peach new PGP key ' + (new Date()).getTime()
  const pgpSignature = await OpenPGP.sign(message, pgp.publicKey, pgp.privateKey, '')

  return {
    publicKey: peachAccount.publicKey.toString('hex'),
    pgpPublicKey: pgp.publicKey,
    signature: peachAccount.sign(bitcoin.crypto.sha256(Buffer.from(pgp.publicKey))).toString('hex'),
    message,
    pgpSignature,
  }
}

export type UpdateUserProps = {
  pgp?: PGPKeychain
  fcmToken?: string
  referralCode?: string
}

/**
 * @description Method to send user update information to server
 * @param pgp pgp keychain
 * @param fcmToken fcm token
 * @param referralCode referal code
 * @returns APISuccess
 */
export const updateUser = async ({
  pgp,
  fcmToken,
  referralCode
}: UpdateUserProps): Promise<[APISuccess|null, APIError|null]> => {
  if (!peachAccount) return [null, { error: 'UNAUTHORIZED' }]

  const response = await fetch(`${API_URL}/v1/user`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'PATCH',
    body: JSON.stringify({
      ...getPGPUpdatePayload(pgp),
      fcmToken,
      referralCode
    })
  })

  return await parseResponse<APISuccess>(response, 'updateUser')
}