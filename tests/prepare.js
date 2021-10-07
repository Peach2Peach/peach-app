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
jest.mock('react-native-neomorph-shadows')
