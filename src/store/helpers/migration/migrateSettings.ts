import { SettingsStore } from '../../settingsStore'
import { version0 } from './version0'
import { version1 } from './version1'

export const migrateSettings = (persistedState: unknown, version: number) => {
  let migratedState = persistedState as SettingsStore
  if (version < 1) {
    migratedState = version0(migratedState)
  }
  if (version < 2) {
    migratedState = version1(migratedState)
  }

  return migratedState
}
