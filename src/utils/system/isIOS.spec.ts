import { ok } from 'assert'
import { Platform } from 'react-native'
import { isIOS } from './isIOS'

describe('isIOS', () => {
  it('checks whether app is running on android', () => {
    jest.replaceProperty(Platform, 'OS', 'ios')
    ok(isIOS())
    jest.replaceProperty(Platform, 'OS', 'android')
    ok(!isIOS())
  })
})
