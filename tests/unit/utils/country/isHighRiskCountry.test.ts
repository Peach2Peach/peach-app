import { isHighRiskCountry } from '../../../../src/utils/country'

jest.mock('../../../../src/utils/country/countryMap', () => ({
  countryMap: {
    CH: {
      highRisk: false,
    },
    CM: {
      highRisk: true,
    },
  },
}))

describe('isHighRiskCountry', () => {
  it('returns true if a country is of high risk', () => {
    expect(isHighRiskCountry('CM')).toEqual(true)
  })
  it('returns false if a country is not of high risk', () => {
    expect(isHighRiskCountry('CH')).toEqual(false)
  })
  it('returns true if a country is unknown', () => {
    // @ts-expect-error
    expect(isHighRiskCountry('XX')).toEqual(true)
  })
})
