import { UserDataStore } from '../../store'
import { info } from '../../utils/log'
import { accountStorage } from '../../utils/storage/accountStorage'
import { migrateAccountToSecureStorage } from './migrateAccountToSecureStorage'

export const dataMigration = async (userDataStore: UserDataStore) => {
  info('dataMigration - start')

  if (!accountStorage.getString('publicKey')) {
    await migrateAccountToSecureStorage(userDataStore)
  }

  info('dataMigration - done')
}
