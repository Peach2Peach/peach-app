import { sleep } from '.'

describe('sleep function', () => {
  it('should wait for the specified amount of time', async () => {
    const start = Date.now()
    await sleep(1000)
    const end = Date.now()
    expect(end - start).toBeGreaterThanOrEqual(1000)
  })

  it('should resolve with no errors', async () => {
    await expect(sleep(1000)).resolves.toBeUndefined()
  })
})
