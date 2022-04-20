import { BackHandler } from 'react-native'

export default () => {
  // Disable OS back button
  BackHandler.addEventListener('hardwareBackPress', () => true)
}