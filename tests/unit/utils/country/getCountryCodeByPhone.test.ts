import { getCountryCodeByPhone } from '../../../../src/utils/country'

jest.mock('../../../../src/utils/country/countryMap', () => ({
  countryMap: {
    CH: {
      dialCode: '+41',
    },
    ES: {
      dialCode: '+34',
    },
  },
}))

describe('getCountryCodeByPhone', () => {
  it('returns the country code that the phone number belongs to', () => {
    expect(getCountryCodeByPhone('+411234566')).toEqual('CH')
    expect(getCountryCodeByPhone('+34029384')).toEqual('ES')
  })
  it('returns undefined if country could not be found', () => {
    expect(getCountryCodeByPhone('+99029384')).toEqual(undefined)
  })
})
