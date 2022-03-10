import { account, saveAccount } from '.'
import { session } from '../session'

/**
 * @description Method to update app settings
 * @param options settings to update
 */
export const updateSettings = (options: Settings): void => {
  account.settings = {
    ...account.settings,
    ...options
  }
  if (session.password) saveAccount(account, session.password)
}