import { accountStorage } from '../../utils/account/accountStorage'
import { checkBackupUpdate } from './checkBackupUpdate'
import { migrateAccountToSecureStorage } from './migrateAccountToSecureStorage'

export const dataMigrationBeforeLoadingAccount = async () => {
  if (!accountStorage.getString('publicKey')) {
    await migrateAccountToSecureStorage()
  }
  checkBackupUpdate()
}
