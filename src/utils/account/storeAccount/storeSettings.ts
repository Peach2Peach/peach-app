import { APPVERSION } from '../../../constants'
import { writeFile } from '../../file'
import { info } from '../../log'

/**
 * @description Method to save account settings
 * @param settings settings
 * @param password secret
 * @returns promise resolving to encrypted settings
 */
export const storeSettings = async (settings: Account['settings'], password: string): Promise<void> => {
  info('Storing settings')

  settings.appVersion = APPVERSION
  await writeFile('/peach-account-settings.json', JSON.stringify(settings), password)
}
