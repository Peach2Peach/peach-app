import { Platform } from 'react-native'

/**
 * @description Method to check if app is compiled for web
 * @returns {boolean} true if app is compiled for web
 */
export const isWeb = () => Platform.OS === 'web'

/**
 * @description Method to check if app is compiled for android
 * @returns {boolean} true if app is compiled for android
 */
export const isAndroid = () => Platform.OS === 'android'

/**
 * @description Method to check if app is compiled for iOS
 * @returns {boolean} true if app is compiled for iOS
 */
export const isIOS = () => Platform.OS === 'ios'

/**
 * @description Method to check if app is compiled for mobile
 * @returns {boolean} true if app is compiled for mobile
 */
export const isMobile = () => isAndroid() || isIOS()
