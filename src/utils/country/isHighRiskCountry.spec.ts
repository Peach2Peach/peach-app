import { isHighRiskCountry } from '.'

jest.mock('./countryMap', () => ({
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
    // @ts-expect-error testing invalid input
    expect(isHighRiskCountry('XX')).toEqual(true)
  })
  it('returns true if a country is undefined', () => {
    expect(isHighRiskCountry(undefined)).toEqual(true)
  })
})
