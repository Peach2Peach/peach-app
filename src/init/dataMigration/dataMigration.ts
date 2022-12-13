import { UserDataStore } from '../../store'
import { accountStorage } from '../../utils/storage/accountStorage'
import { migrateAccountToSecureStorage } from './migrateAccountToSecureStorage'

export const dataMigration = async (userDataStore: UserDataStore) => {
  if (!accountStorage.getString('publicKey')) {
    await migrateAccountToSecureStorage(userDataStore)
  }
}
