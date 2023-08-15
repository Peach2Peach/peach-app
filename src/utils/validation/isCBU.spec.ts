import { isCBU } from './isCBU'

describe('isCBU', () => {
  it('returns true for valid CBU numbers', () => {
    expect(isCBU('2850590940090418135201')).toBeTruthy()
  })
  it('returns true for invalid CBU numbers', () => {
    expect(isCBU('3850590940090418135201')).toBeFalsy()
    expect(isCBU('285059094009041813520')).toBeFalsy()
    expect(isCBU('28505909400904181352011')).toBeFalsy()
    expect(isCBU('1234')).toBeFalsy()
  })
})
