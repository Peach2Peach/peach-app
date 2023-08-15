import { isCVU } from './isCVU'

describe('isCVU', () => {
  it('return true for CVU with 22 digits', () => {
    expect(isCVU('0123456789012345678912')).toBeTruthy()
  })
  it('return true for CVU not with 22 digits', () => {
    expect(isCVU('012345678901234567891')).toBeFalsy()
    expect(isCVU('01234567890123456789123')).toBeFalsy()
  })
})
