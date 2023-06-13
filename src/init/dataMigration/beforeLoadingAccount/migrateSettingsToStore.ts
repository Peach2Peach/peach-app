import { settingsStore } from '../../../store/settingsStore'
import { loadSettings } from './helpers/loadSettings'

export const migrateSettingsToStore = () => {
  if (settingsStore.getState().migrated) return
  const settings = loadSettings()
  settingsStore.getState().updateSettings(settings)
  settingsStore.getState().setMigrated()
}
