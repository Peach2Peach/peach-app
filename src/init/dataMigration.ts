import { storeAccount } from '../utils/account'
import { accountStorage } from '../utils/account/accountStorage'
import { loadAccountFromFileSystem } from '../utils/account/loadAccount/loadAccountFromFileSystem'
import { info } from '../utils/log'
import { sessionStorage } from '../utils/session'

const migrateAccountToSecureStorage = async () => {
  info('migrateAccountToSecureStorage - start')

  const password = sessionStorage.getString('password')
  let account
  if (password) account = await loadAccountFromFileSystem(password)
  if (account) storeAccount(account)
  info('migrateAccountToSecureStorage - complete')
}

export const dataMigrationBeforeLoadingAccount = async () => {
  if (!accountStorage.getString('publicKey')) {
    await migrateAccountToSecureStorage()
  }
}
export const dataMigrationAfterLoadingAccount = async () => {}
