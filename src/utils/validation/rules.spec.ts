/* eslint-disable max-lines-per-function */
import { ok } from 'assert'
import { rules } from '.'

jest.mock('../wallet/getNetwork', () => ({
  getNetwork: jest.fn(),
}))

describe('rules', () => {
  it('validates required fields correctly', () => {
    ok(rules.required('hello'))
    ok(!rules.required(''))
  })
})
