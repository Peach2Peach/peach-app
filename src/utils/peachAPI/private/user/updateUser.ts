import { API_URL } from '@env'
import { crypto } from 'bitcoinjs-lib'
import OpenPGP from 'react-native-fast-openpgp'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPeachAccount } from '../../peachAccount'
import { getPrivateHeaders } from '../getPrivateHeaders'

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

  const message = `Peach new PGP key ${new Date().getTime()}`
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
  feeRate?: FeeRate
}

export const updateUser = async ({ pgp, fcmToken, referralCode, feeRate, timeout }: UpdateUserProps) => {
  const peachAccount = getPeachAccount()
  if (!peachAccount) return [null, { error: 'UNAUTHORIZED' }]

  const response = await fetch(`${API_URL}/v1/user`, {
    headers: await getPrivateHeaders(),
    method: 'PATCH',
    body: JSON.stringify({
      ...(await getPGPUpdatePayload(pgp)),
      fcmToken,
      referralCode,
      feeRate,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<APISuccess>(response, 'updateUser')
}
