/**
 * @format
 */
import RNFS from 'react-native-fs'
import DocumentPicker from 'react-native-document-picker'
import Share from 'react-native-share'
import init from './src/index'

global.RNFS = RNFS
global.DocumentPicker = DocumentPicker
global.Share = Share

init()