import { ok } from 'assert'
import { getOS } from '../../../../src/utils/system/getOS'
import { isAndroid } from '../../../../src/utils/system/isAndroid'

jest.mock('../../../../src/utils/system/getOS', () => ({
  getOS: jest.fn(),
}))

describe('isAndroid', () => {
  it('checks whether app is running on android', () => {
    ;(<jest.Mock>getOS).mockReturnValue('android')
    ok(isAndroid())
    ;(<jest.Mock>getOS).mockReturnValue('ios')
    ok(!isAndroid())
  })
})
