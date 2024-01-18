import { strictEqual } from 'assert'
import { MSINADAY, MSINAMINUTE, MSINANHOUR, MSINASECOND } from '../../constants'
import { msToTimer } from './msToTimer'

describe('msToTimer', () => {
  it('turns ms to a human readable format', () => {
    const TEN = 10
    const TWELVE = 12
    const FORTYFIVE = 45
    strictEqual(msToTimer(MSINASECOND), '00:00:01')
    strictEqual(msToTimer(MSINASECOND * FORTYFIVE), '00:00:45')
    strictEqual(msToTimer(MSINAMINUTE), '00:01:00')
    strictEqual(msToTimer(MSINAMINUTE + MSINASECOND), '00:01:01')
    strictEqual(msToTimer(MSINANHOUR - MSINAMINUTE), '00:59:00')
    strictEqual(msToTimer(MSINANHOUR + MSINAMINUTE), '01:01:00')
    strictEqual(msToTimer(MSINANHOUR + MSINASECOND * TWELVE), '01:00:12')
    strictEqual(msToTimer(MSINANHOUR * TEN), '10:00:00')
    strictEqual(msToTimer(MSINADAY / 2), '12:00:00')
    strictEqual(msToTimer(MSINADAY / 2 + MSINASECOND * FORTYFIVE), '12:00:45')
  })
})
