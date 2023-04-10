import { settingsStore } from '../../../store/settingsStore'
import { loadSettings } from './helpers/loadSettings'

export const migrateSettingsToStore = async () => {
  if (settingsStore.getState().migrated) return
  const settings = await loadSettings()
  settingsStore.getState().updateSettings(settings)
  settingsStore.getState().setMigrated()
}
