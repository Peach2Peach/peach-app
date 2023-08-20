import { ok } from 'assert'
import { getOS } from './getOS'
import { isAndroid } from './isAndroid'

jest.mock('./getOS', () => ({
  getOS: jest.fn(),
}))

describe('isAndroid', () => {
  it('checks whether app is running on android', () => {
    (<jest.Mock>getOS).mockReturnValue('android')
    ok(isAndroid())
    ;(<jest.Mock>getOS).mockReturnValue('ios')
    ok(!isAndroid())
  })
})
