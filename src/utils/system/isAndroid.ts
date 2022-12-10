import { Platform } from 'react-native'

/**
 * @description Method to check if app is compiled for android
 */
export const isAndroid = () => Platform.OS === 'android'
