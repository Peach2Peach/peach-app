import { info } from '../../../utils/log'
import { SettingsStore } from '../../settingsStore'

export const version0 = (migratedState: SettingsStore) => {
  info('settingsStore - migrating from version 0')
  // if the stored value is in version 0, we rename the field to the new name
  migratedState.lastFileBackupDate = migratedState.lastBackupDate
  delete migratedState.lastBackupDate
  return migratedState
}
