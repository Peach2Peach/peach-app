import { ok } from 'assert'
import { compatibilityCheck } from '.'

describe('compatibilityCheck', () => {
  it('checks whether current version is compatible with minimum version', () => {
    ok(compatibilityCheck('0.0.1', '0.0.1'))
    ok(compatibilityCheck('0.0.2', '0.0.1'))
    ok(compatibilityCheck('0.1.0', '0.1.0'))
    ok(compatibilityCheck('1.0.0', '1.0.0'))
    ok(compatibilityCheck('1.0.1', '1.0.0'))
    ok(compatibilityCheck('0.0.1-rc.1', '0.0.1-rc.1'))
    ok(compatibilityCheck('0.0.1-rc.2', '0.0.1-rc.1'))
    ok(compatibilityCheck('0.1.4-82', '0.1.4-82'))
    ok(compatibilityCheck('0.1.4-83', '0.1.4-82'))
    ok(compatibilityCheck('0.1.10', '0.1.8'))
    ok(!compatibilityCheck('1.0.1', '1.0.2'))
    ok(!compatibilityCheck('0.0.3', '1.0.2'))
    ok(!compatibilityCheck('0.0.2', '0.0.3'))
    ok(!compatibilityCheck('0.0.1-rc.2', '0.0.1-rc.3'))
    ok(!compatibilityCheck('1.0.1-rc.2', '1.0.2.rc-3'))
    ok(!compatibilityCheck('0.0.3-rc.2', '1.0.2.rc-3'))
    ok(!compatibilityCheck('0.0.2-rc.2', '0.0.3.rc-3'))
    ok(!compatibilityCheck('0.1.4', '0.1.4-83'))
    ok(!compatibilityCheck('0.1.4-82', '0.1.4-83'))
    ok(!compatibilityCheck('0.1.8', '0.1.10'))
  })
})
