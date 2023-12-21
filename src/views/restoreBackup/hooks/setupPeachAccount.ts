import { NETWORK } from '@env'
import { sha256 } from 'bitcoinjs-lib/src/crypto'
import { getAuthenticationChallenge } from '../../../../peach-api/src/helpers/getAuthenticationChallenge'
import { UNIQUEID } from '../../../constants'
import { createPeachAccount } from '../../../utils/account/createPeachAccount'
import { getMainAccount } from '../../../utils/account/getMainAccount'
import { loadWalletFromAccount } from '../../../utils/account/loadWalletFromAccount'
import { peachAPI } from '../../../utils/peachAPI'

export async function setupPeachAccount (recoveredAccount: Account) {
  const wallet = loadWalletFromAccount(recoveredAccount)
  const peachAccount = createPeachAccount(wallet)
  peachAPI.setPeachAccount(peachAccount)

  const authResponse = await peachAPI.authenticate()
  if (authResponse?.error?.error === 'NOT_FOUND') {
    const message = getAuthenticationChallenge()
    const firstAddress = getMainAccount(wallet, NETWORK)
    const signature = firstAddress.sign(sha256(Buffer.from(message))).toString('hex')

    const { error: registerError } = await peachAPI.private.user.register({
      publicKey: recoveredAccount.publicKey,
      message,
      signature,
      uniqueId: UNIQUEID,
    })
    return registerError?.error
  }
  return authResponse?.error?.error
}
