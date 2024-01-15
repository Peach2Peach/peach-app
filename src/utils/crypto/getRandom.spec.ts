import { getRandom } from './getRandom'

describe('getRandom', () => {
  const bytes = 16
  const expectedLength = 32
  it('returns random butes', async () => {
    const random1 = await getRandom(bytes)
    const random2 = await getRandom(bytes)

    expect(random1.toString('hex')).toHaveLength(expectedLength)
    expect(random1).not.toBe(random2)
  })
})
