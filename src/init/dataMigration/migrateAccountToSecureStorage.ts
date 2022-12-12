import { exists } from 'react-native-fs'
import { loadAccountFromFileSystem } from '../../utils/account/loadAccount/loadAccountFromFileSystem'
import { deleteFile, readDir } from '../../utils/file'
import { info } from '../../utils/log'
import { sessionStorage } from '../../utils/session'
import {
  chatStorage,
  useAccountStore,
  useContractsStore,
  useOffersStore,
  usePaymentDataStore,
} from '../../utils/storage'

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
  if (password) {
    const legacyAccount = await loadAccountFromFileSystem(password)
    if (!legacyAccount) {
      info('migrateAccountToSecureStorage - no legacy account found')
      return
    }
    const setAccount = useAccountStore((state) => state.setAccount)
    const setAllPaymentData = usePaymentDataStore((state) => state.setAllPaymentData)
    const setOffer = useOffersStore((state) => state.setOffer)
    const setContract = useContractsStore((state) => state.setContract)

    setAccount(legacyAccount)
    setAllPaymentData(
      legacyAccount.paymentData.reduce((obj, data) => {
        obj[data.id] = data
        return obj
      }, {} as Record<string, PaymentData>),
    )
    legacyAccount.offers.forEach(setOffer)
    legacyAccount.contracts.forEach(setContract)
    Object.values(legacyAccount.chats).forEach((chat) => chatStorage.setMap(chat.id, chat))
  }

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
