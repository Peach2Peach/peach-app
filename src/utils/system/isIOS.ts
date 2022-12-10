import { getOS } from './getOS'

/**
 * @description Method to check if app is compiled for iOS
 */
export const isIOS = () => getOS() === 'ios'
