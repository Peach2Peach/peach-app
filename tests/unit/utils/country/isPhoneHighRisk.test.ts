import { isPhoneHighRisk } from '../../../../src/utils/country'

jest.mock('../../../../src/utils/country/countryMap', () => ({
  countryMap: {
    CH: {
      dialCode: '+41',
      highRisk: false,
    },
    CM: {
      dialCode: '+237',
      highRisk: true,
    },
  },
}))

describe('isPhoneHighRisk', () => {
  it('returns true if a phone is from a high risk country', () => {
    expect(isPhoneHighRisk('+2371234566')).toEqual(true)
  })
  it('returns false if a phone is not from a high risk country', () => {
    expect(isPhoneHighRisk('+411230984')).toEqual(false)
  })
  it('returns true if a phone does not belong to any country', () => {
    expect(isPhoneHighRisk('+9903298')).toEqual(true)
  })
})
