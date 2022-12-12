import { accountStorage } from '../../utils/storage/accountStorage'
import { migrateAccountToSecureStorage } from './migrateAccountToSecureStorage'

export const dataMigrationBeforeLoadingAccount = async () => {
  if (!accountStorage.getString('publicKey')) {
    await migrateAccountToSecureStorage()
  }
}
