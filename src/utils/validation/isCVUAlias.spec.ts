import { isCVUAlias } from './isCVUAlias'

describe('isCVUAlias', () => {
  it('return true for CVU between 6 and digits', () => {
    expect(isCVUAlias('123456')).toBeTruthy()
    expect(isCVUAlias('01234567890123456789')).toBeTruthy()
  })
  it('return true for CVU not between 6 and 20 digits', () => {
    expect(isCVUAlias('012345678901234567891')).toBeFalsy()
    expect(isCVUAlias('12345')).toBeFalsy()
  })
})
