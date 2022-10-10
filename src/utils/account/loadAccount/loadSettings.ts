import { defaultAccount } from '../'
import { readFile } from '../../file'
import { error } from '../../log'
import { parseError } from '../../system'

/**
 * @description Method to load account settings
 * @param password password
 * @returns Promise resolving to account settings
 */
export const loadSettings = async (password: string): Promise<Account['settings']> => {
  try {
    const settings = await readFile('/peach-account-settings.json', password)
    return JSON.parse(settings)
  } catch (e) {
    error('Could not load settings', parseError(e))
    return defaultAccount.settings
  }
}
