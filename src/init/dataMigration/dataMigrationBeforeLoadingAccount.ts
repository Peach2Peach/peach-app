import { migratePaymentDataToStore } from './beforeLoadingAccount/migratePaymentDataToStore'
import { migrateSettingsToStore } from './beforeLoadingAccount/migrateSettingsToStore'

export const dataMigrationBeforeLoadingAccount = () => {
  migrateSettingsToStore()
  migratePaymentDataToStore()
}
