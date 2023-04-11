import { migrateSettingsToStore } from './beforeLoadingAccount/migrateSettingsToStore'

export const dataMigrationBeforeLoadingAccount = async () => {
  migrateSettingsToStore()
}
