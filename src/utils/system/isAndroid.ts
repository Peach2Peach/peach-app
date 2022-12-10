import { getOS } from './getOS'

/**
 * @description Method to check if app is compiled for android
 */
export const isAndroid = () => getOS() === 'android'
