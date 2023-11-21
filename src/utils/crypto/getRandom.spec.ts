import { notDeepStrictEqual } from 'assert'
import { getRandom } from './getRandom'

describe('getRandom', () => {
  it('returns random butes', async () => {
    const random1 = await getRandom(16)
    const random2 = await getRandom(16)
    notDeepStrictEqual(random1, random2)
  })
})
