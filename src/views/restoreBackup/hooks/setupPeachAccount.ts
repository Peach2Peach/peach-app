import { createPeachAccount } from '../../../utils/account/createPeachAccount'
import { loadWalletFromAccount } from '../../../utils/account/loadWalletFromAccount'
import { peachAPI } from '../../../utils/peachAPI'
import { setPeachAccount } from '../../../utils/peachAPI/peachAccount'

export async function setupPeachAccount (recoveredAccount: Account) {
  const wallet = loadWalletFromAccount(recoveredAccount)
  const peachAccount = createPeachAccount(wallet)
  setPeachAccount(peachAccount)
  peachAPI.setPeachAccount(peachAccount)

  const response = await peachAPI.authenticate()
  return response?.error?.error
}
