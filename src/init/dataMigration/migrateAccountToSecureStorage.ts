import { exists } from 'react-native-fs'
import { storeAccount } from '../../utils/account'
import { loadAccountFromFileSystem } from '../../utils/account/loadAccount/loadAccountFromFileSystem'
import { deleteFile, readDir } from '../../utils/file'
import { info } from '../../utils/log'
import { sessionStorage } from '../../utils/session'

const accountFiles = [
  '/peach-account-identity.json',
  '/peach-account-settings.json',
  '/peach-account-tradingLimit.json',
  '/peach-account-paymentData.json',
  '/peach-account-offers.json',
  '/peach-account-contracts.json',
  '/peach-account-chats.json',
  '/peach-account.json',
]

const accountFolders = ['/peach-account-offers', '/peach-account-contracts']

export const migrateAccountToSecureStorage = async () => {
  info('migrateAccountToSecureStorage - copying to MMKV storage')

  const password = sessionStorage.getString('password')
  let account
  if (password) account = await loadAccountFromFileSystem(password)
  if (account) storeAccount(account)

  info('migrateAccountToSecureStorage - deleting legacy files')

  accountFiles.forEach(async (file) => {
    if (await exists(file)) await deleteFile(file)
  })

  accountFolders.forEach(async (folder) => {
    if (!(await exists(folder))) return
    const files = await readDir(folder)
    await Promise.all(files.map((file) => deleteFile(file)))
  })

  info('migrateAccountToSecureStorage - complete')
}
