import { isIOS } from './isIOS'
import { linkToAppStoreAndroid } from './linkToAppStoreAndroid'
import { linkToAppStoreIOS } from './linkToAppStoreIOS'

export const linkToAppStore = async () => {
  if (isIOS()) {
    linkToAppStoreIOS()
  } else {
    linkToAppStoreAndroid()
  }
}
