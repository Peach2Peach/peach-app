import { useSettingsStore } from '../../../store/useSettingsStore'
import { loadSettings } from './helpers/loadSettings'

export const migrateSettingsToStore = () => {
  if (useSettingsStore.getState().migrated) return
  const settings = loadSettings()
  useSettingsStore.getState().updateSettings(settings)
  useSettingsStore.getState().setMigrated()
}
