import { info } from '../../../utils/log'
import { SettingsStoreVersion1 } from './version1'

type SettingsStoreVersion0 = SettingsStoreVersion1

export const version0 = (migratedState: SettingsStoreVersion0): SettingsStoreVersion1 => {
  info('settingsStore - migrating from version 0')
  // if the stored value is in version 0, we rename the field to the new name
  migratedState.lastFileBackupDate = migratedState.lastBackupDate
  delete migratedState.lastBackupDate
  return migratedState
}
