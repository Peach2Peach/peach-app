import { ok } from 'assert'
import { getOS } from './getOS'
import { isIOS } from './isIOS'

jest.mock('./getOS', () => ({
  getOS: jest.fn(),
}))

describe('isIOS', () => {
  it('checks whether app is running on android', () => {
    ;(<jest.Mock>getOS).mockReturnValue('ios')
    ok(isIOS())
    ;(<jest.Mock>getOS).mockReturnValue('android')
    ok(!isIOS())
  })
})
