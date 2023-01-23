import { account } from '.'
import { storeSettings } from './storeAccount'

/**
 * @description Method to update app settings
 * @param options settings to update
 * @param save if true save account on device
 * @deprecated
 */
export const updateSettings = async (options: Partial<Settings>, save?: boolean): Promise<void> => {
  account.settings = {
    ...account.settings,
    ...options,
  }
  if (save) await storeSettings(account.settings)
}
