import { migrateContractsToStore } from './beforeLoadingAccount/migrateContractsToStore'

export const dataMigrationBeforeLoadingAccount = async () => {
  await migrateContractsToStore()
}
