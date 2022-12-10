import { Platform } from 'react-native'

/**
 * @description Method to check if app is compiled for iOS
 */
export const isIOS = () => Platform.OS === 'ios'
