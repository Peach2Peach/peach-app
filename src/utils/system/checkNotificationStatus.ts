import { checkNotificationStatusIOS } from './checkNotificationStatusIOS'
import { checkNotificationStatusAndroid } from './checkNotificationStatusAndroid'
import { isIOS } from './isIOS'

/**
 * @description Method to check if app is allowed to receive push notifications
 * @returns true if notifications are enabled
 */
export const checkNotificationStatus = async (): Promise<boolean> =>
  await (isIOS() ? checkNotificationStatusIOS() : checkNotificationStatusAndroid())
