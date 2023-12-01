import { crypto } from 'bitcoinjs-lib'
import OpenPGP from 'react-native-fast-openpgp'
import { peachAPI } from './peachAPI'

const getPGPUpdatePayload = async (pgp?: PGPKeychain) => {
  const peachAccount = peachAPI.options.peachAccount
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

export type UpdateUserProps = {
  pgp?: PGPKeychain
  fcmToken?: string
  referralCode?: string
  feeRate?: FeeRate
}

export const updateUser = async ({ pgp, fcmToken, referralCode, feeRate }: UpdateUserProps) => {
  const peachAccount = peachAPI.options.peachAccount
  if (!peachAccount) return [null, { error: 'UNAUTHORIZED' }]
  const { result, error } = await peachAPI.private.user.updateUser({
    ...(await getPGPUpdatePayload(pgp)),
    fcmToken,
    referralCode,
    feeRate,
  })

  return [result, error]
}
