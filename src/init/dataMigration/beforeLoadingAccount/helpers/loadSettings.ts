import { defaultSettings } from '../../../../store/useSettingsStore'
import { accountStorage } from '../../../../utils/account/accountStorage'
import { error } from '../../../../utils/log'

export const loadSettings = () => {
  const settings = accountStorage.getMap('settings')

  if (settings) return settings as Settings

  error('Could not load settings')
  return defaultSettings
}
