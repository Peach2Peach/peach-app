/* eslint-disable no-magic-numbers */
import { getDateSuffix } from './getDateSuffix'

describe('getDateSuffix', () => {
  it('should return the correct suffix for a given date', () => {
    expect(getDateSuffix(1)).toEqual('st')
    expect(getDateSuffix(2)).toEqual('nd')
    expect(getDateSuffix(3)).toEqual('rd')
    expect(getDateSuffix(4)).toEqual('th')
    expect(getDateSuffix(11)).toEqual('th')
    expect(getDateSuffix(12)).toEqual('th')
    expect(getDateSuffix(13)).toEqual('th')
  })

  it('should handle dates with suffixes greater than 13', () => {
    expect(getDateSuffix(14)).toEqual('th')
    expect(getDateSuffix(20)).toEqual('th')
    expect(getDateSuffix(21)).toEqual('st')
    expect(getDateSuffix(22)).toEqual('nd')
    expect(getDateSuffix(23)).toEqual('rd')
    expect(getDateSuffix(24)).toEqual('th')
  })

  it('should handle dates with suffixes of 0', () => {
    expect(getDateSuffix(0)).toEqual('th')
    expect(getDateSuffix(10)).toEqual('th')
    expect(getDateSuffix(100)).toEqual('th')
  })
})
