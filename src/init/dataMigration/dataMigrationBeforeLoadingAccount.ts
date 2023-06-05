import { migrateAccountToStore } from './beforeLoadingAccount/migrateAccountToStore'
import { migrateContractsToStore } from './beforeLoadingAccount/migrateContractsToStore'
import { migrateSettingsToStore } from './beforeLoadingAccount/migrateSettingsToStore'

export const dataMigrationBeforeLoadingAccount = async () => {
  migrateAccountToStore()
  migrateSettingsToStore()
  migrateContractsToStore()
}
