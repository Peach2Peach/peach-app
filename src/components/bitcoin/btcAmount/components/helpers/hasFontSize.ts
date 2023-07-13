import { TextStyle } from 'react-native'

export const hasFontSize = (s: false | TextStyle): s is TextStyle => s !== false && s?.fontSize !== undefined
