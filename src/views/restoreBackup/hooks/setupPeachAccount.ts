import { crypto } from 'bitcoinjs-lib'
import { UNIQUEID } from '../../../constants'
import { createPeachAccount } from '../../../utils/account/createPeachAccount'
import { loadWalletFromAccount } from '../../../utils/account/loadWalletFromAccount'
import { error } from '../../../utils/log'
import { peachAPI } from '../../../utils/peachAPI'
import { getAuthenticationChallenge } from '../../../utils/peachAPI/getAuthenticationChallenge'
import { getPeachAccount, setPeachAccount } from '../../../utils/peachAPI/peachAccount'

export async function setupPeachAccount (recoveredAccount: Account) {
  const wallet = loadWalletFromAccount(recoveredAccount)
  const peachAccount = createPeachAccount(wallet)
  setPeachAccount(peachAccount)
  peachAPI.setPeachAccount(peachAccount)

  // TODO: Go through this together
  await peachAPI.authenticate()
  return (await auth())?.error
}

async function auth () {
  const peachAccount = getPeachAccount()
  const message = getAuthenticationChallenge()

  if (!peachAccount) {
    const authError = new Error('Peach Account not set')
    error(authError)
    throw authError
  }

  const parsedResponse = await peachAPI.private.user.auth({
    publicKey: peachAccount.publicKey.toString('hex'),
    uniqueId: UNIQUEID,
    message,
    signature: peachAccount.sign(crypto.sha256(Buffer.from(message))).toString('hex'),
  })

  return parsedResponse.error
}
