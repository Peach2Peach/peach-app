import { createPeachAccount } from '../../../utils/account/createPeachAccount'
import { loadWalletFromAccount } from '../../../utils/account/loadWalletFromAccount'
import { auth, peachAPI } from '../../../utils/peachAPI'
import { setPeachAccount } from '../../../utils/peachAPI/peachAccount'

export async function setupPeachAccount (recoveredAccount: Account) {
  const wallet = loadWalletFromAccount(recoveredAccount)
  const peachAccount = createPeachAccount(wallet)
  setPeachAccount(peachAccount)
  peachAPI.setPeachAccount(peachAccount)
  await peachAPI.authenticate()

  const [, authError] = await auth({})
  return authError?.error
}
