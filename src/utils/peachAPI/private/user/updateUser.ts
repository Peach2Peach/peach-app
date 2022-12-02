import { API_URL } from '@env'
import { crypto } from 'bitcoinjs-lib'
import OpenPGP from 'react-native-fast-openpgp'
import { RequestProps } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPeachAccount } from '../../peachAccount'
import { fetchAccessToken } from './fetchAccessToken'

type PGPPayload = {
  publicKey: string
  pgpPublicKey: string
  signature: string
  message: string
  pgpSignature: string
}

const getPGPUpdatePayload = async (pgp?: PGPKeychain): Promise<{} | PGPPayload> => {
  const peachAccount = getPeachAccount()
  if (!peachAccount || !pgp) return {}

  const message = 'Peach new PGP key ' + new Date().getTime()
  const pgpSignature = await OpenPGP.sign(message, pgp.publicKey, pgp.privateKey, '')

  return {
    publicKey: peachAccount.publicKey.toString('hex'),
    pgpPublicKey: pgp.publicKey,
    signature: peachAccount.sign(crypto.sha256(Buffer.from(pgp.publicKey))).toString('hex'),
    message,
    pgpSignature,
  }
}

export type UpdateUserProps = RequestProps & {
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
  referralCode,
  timeout,
}: UpdateUserProps): Promise<[APISuccess | null, APIError | null]> => {
  const peachAccount = getPeachAccount()
  if (!peachAccount) return [null, { error: 'UNAUTHORIZED' }]

  const response = await fetch(`${API_URL}/v1/user`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify({
      ...(await getPGPUpdatePayload(pgp)),
      fcmToken,
      referralCode,
    }),
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<APISuccess>(response, 'updateUser')
}
