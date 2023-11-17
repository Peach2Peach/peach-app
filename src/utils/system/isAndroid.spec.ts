import { ok } from 'assert'
import { Platform } from 'react-native'
import { isAndroid } from './isAndroid'

describe('isAndroid', () => {
  it('checks whether app is running on android', () => {
    jest.replaceProperty(Platform, 'OS', 'android')
    ok(isAndroid())
    jest.replaceProperty(Platform, 'OS', 'ios')
    ok(!isAndroid())
  })
})
