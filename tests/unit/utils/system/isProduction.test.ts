import { ok } from 'assert'
import { isProduction } from '../../../../src/utils/system/isProduction'

describe('isProduction', () => {
  it('checks whether app is running on android', () => {
    // note the mock in prepare.js is setting DEV: 'true'
    // if you know how to change the value within this test, feel free to improve this test
    ok(!isProduction())
  })
})
