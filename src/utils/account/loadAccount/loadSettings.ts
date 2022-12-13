import { defaultAccount } from '../'
import { error } from '../../log'
import { accountStorage } from '../../storage'

export const loadSettings = async (): Promise<Account['settings']> => {
  const settings = accountStorage.getMap('settings')

  if (settings) return settings as Account['settings']

  error('Could not load settings')
  return defaultAccount.settings
}
