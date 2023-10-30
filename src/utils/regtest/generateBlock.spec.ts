import { generateBlock } from './generateBlock'

const fetchMock = jest.fn()
jest.mock(
  '../fetch',
  () =>
    (...args: unknown[]) =>
      fetchMock(...args),
)

describe('generateBlock', () => {
  it('should call correct api endpoint', async () => {
    await generateBlock()
    expect(fetchMock).toHaveBeenCalledWith('https://localhost:8080/v1/regtest/generateBlock', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Origin: 'https://localhost:8080',
        Referer: 'https://localhost:8080',
        'User-Agent': '',
      },
      method: 'GET',
    })
  })
})
