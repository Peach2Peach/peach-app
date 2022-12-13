import { defaultAccount } from '../account'
import { readFile } from '../file'
import { error } from '../log'
import { parseError } from '../system'

/**
 * @deprecated
 */
export const loadSettingsFromFileSystem = async (password: string): Promise<LegacyAccount['settings']> => {
  try {
    const settings = await readFile('/peach-account-settings.json', password)
    return JSON.parse(settings)
  } catch (e) {
    error('Could not load settings', parseError(e))
    return defaultAccount.settings
  }
}
