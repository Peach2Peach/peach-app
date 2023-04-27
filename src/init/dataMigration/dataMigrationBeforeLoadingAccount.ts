import { migrateContractsToStore } from './beforeLoadingAccount/migrateContractsToStore'
import { migrateSettingsToStore } from './beforeLoadingAccount/migrateSettingsToStore'

export const dataMigrationBeforeLoadingAccount = async () => {
  migrateSettingsToStore()
  migrateContractsToStore()
}
