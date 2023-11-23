import { strictEqual } from 'assert'
import { msToTimer } from './msToTimer'

describe('msToTimer', () => {
  it('turns ms to a human readable format', () => {
    strictEqual(msToTimer(1000), '00:00:01')
    strictEqual(msToTimer(1000 * 45), '00:00:45')
    strictEqual(msToTimer(1000 * 60), '00:01:00')
    strictEqual(msToTimer(1000 * 61), '00:01:01')
    strictEqual(msToTimer(1000 * 60 * 59), '00:59:00')
    strictEqual(msToTimer(1000 * 60 * 61), '01:01:00')
    strictEqual(msToTimer(1000 * 60 * 60 + 1000 * 12), '01:00:12')
    strictEqual(msToTimer(1000 * 60 * 60 * 10), '10:00:00')
    strictEqual(msToTimer(1000 * 60 * 60 * 12), '12:00:00')
    strictEqual(msToTimer(1000 * 60 * 60 * 12 + 1000 * 45), '12:00:45')
  })
})
