import { ok } from 'assert'
import { getOS } from '../../../../src/utils/system/getOS'
import { isIOS } from '../../../../src/utils/system/isIOS'

jest.mock('../../../../src/utils/system/getOS', () => ({
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
