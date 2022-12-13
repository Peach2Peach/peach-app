import { APPVERSION } from '../../../constants'
import { info } from '../../log'
import { accountStorage } from '../../storage'

export const storeSettings = async (settings: Account['settings']) => {
  info('storeSettings - Storing settings')

  settings.appVersion = APPVERSION
  accountStorage.setMap('settings', settings)
}
