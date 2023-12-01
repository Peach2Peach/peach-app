import { API_URL } from '@env'
import { getPublicHeaders } from './getPublicHeaders'

describe('getPublicHeaders', () => {
  it('should return an object with the correct keys', () => {
    const result = getPublicHeaders()
    expect(result).toStrictEqual({
      Origin: API_URL,
      Referer: API_URL,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': '',
    })
  })
})
