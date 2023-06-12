import { SettingsStore } from '../../settingsStore'
import { version0 } from './version0'
import { SettingsStoreVersion1, version1 } from './version1'

const wasVersion0 = (persistedState: unknown, version: number): persistedState is SettingsStoreVersion1 => version < 1

const wasVersion1 = (persistedState: unknown, version: number): persistedState is SettingsStoreVersion1 => version < 2

export const migrateSettings = (persistedState: unknown, version: number) => {
  let migratedState = persistedState as SettingsStore | SettingsStoreVersion1
  if (wasVersion0(migratedState, version)) {
    migratedState = version0(migratedState)
  }
  if (wasVersion1(migratedState, version)) {
    migratedState = version1(migratedState)
  }

  return migratedState
}
