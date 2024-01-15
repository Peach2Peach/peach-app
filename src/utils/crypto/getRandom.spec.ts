import { getRandom } from './getRandom'

describe('getRandom', () => {
  const bytes = 16
  it('returns random butes', async () => {
    const random1 = await getRandom(bytes)
    const random2 = await getRandom(bytes)

    expect(random1.byteLength).toEqual(bytes)
    expect(random1).not.toBe(random2)
  })
})
