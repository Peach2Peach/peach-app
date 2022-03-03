import RNFS from 'react-native-fs'
import DocumentPicker from 'react-native-document-picker'
import Share from 'react-native-share'

global.RNFS = RNFS
global.DocumentPicker = DocumentPicker
global.Share = Share

jest.mock('react-native-screens', () => ({
  ...jest.requireActual('react-native-screens'),
  enableScreens: jest.fn()
}))

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
jest.mock('react-native-qrcode-scanner', () => jest.fn())
jest.mock('react-native-snap-carousel', () => jest.fn())
jest.mock('@react-native-clipboard/clipboard', () => jest.fn())
jest.mock('@env', () => ({
  DEV: 'true',
  API_URL: 'https://localhost:8080/',
  HTTP_AUTH_USER: 'value',
  HTTP_AUTH_PASS: 'value2'
}))
