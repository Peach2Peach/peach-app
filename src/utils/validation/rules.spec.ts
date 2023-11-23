import { ok } from 'assert'
import { rules } from './rules'

describe('rules', () => {
  it('validates required fields correctly', () => {
    ok(rules.required('hello'))
    ok(!rules.required(''))
  })
})
