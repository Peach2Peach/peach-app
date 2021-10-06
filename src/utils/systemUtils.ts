import { Platform } from 'react-native'

/**
 * @description Method to check if app is compiled for web
 * @returns true if app is compiled for web
 */
export const isWeb = () => Platform.OS === 'web'

/**
 * @description Method to check if app is compiled for android
 * @returns true if app is compiled for android
 */
export const isAndroid = () => Platform.OS === 'android'

/**
 * @description Method to check if app is compiled for iOS
 * @returns true if app is compiled for iOS
 */
export const isIOS = () => Platform.OS === 'ios'

/**
 * @description Method to check if app is compiled for mobile
 * @returns true if app is compiled for mobile
 */
export const isMobile = () => isAndroid() || isIOS()
