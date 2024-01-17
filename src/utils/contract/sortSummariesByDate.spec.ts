/* eslint-disable no-magic-numbers */
import { sortSummariesByDate } from './sortSummariesByDate'

describe('sortSummariesByDate', () => {
  it('should return 1, -1 or 0 accordingly when both contracts have paymentConfirmed date', () => {
    const contract1 = {
      paymentMade: new Date(2022, 0, 1),
      creationDate: new Date(2022, 0, 1),
    }

    const contract2 = {
      paymentMade: new Date(2022, 0, 2),
      creationDate: new Date(2022, 0, 1),
    }
    expect(sortSummariesByDate(contract1, contract2)).toBe(-1)
    expect(sortSummariesByDate(contract2, contract1)).toBe(1)
    expect(sortSummariesByDate(contract1, contract1)).toBe(0)
  })
  it('should return 1, -1 or 0 accordingly when only one contract has paymentMade date', () => {
    const contract1 = {
      paymentMade: new Date(2022, 0, 2),
      creationDate: new Date(2022, 0, 1),
    }

    const contract2 = {
      paymentMade: undefined,
      creationDate: new Date(2022, 0, 1),
    }
    expect(sortSummariesByDate(contract1, contract2)).toBe(1)
    expect(sortSummariesByDate(contract2, contract1)).toBe(-1)
    expect(sortSummariesByDate(contract1, contract1)).toBe(0)
  })
  it('should return 1, -1 or 0 accordingly when both contracts only have creationDate', () => {
    const contract1 = {
      paymentMade: undefined,
      creationDate: new Date(2022, 0, 1),
    }

    const contract2 = {
      paymentMade: undefined,
      creationDate: new Date(2022, 0, 2),
    }
    expect(sortSummariesByDate(contract1, contract2)).toBe(-1)
    expect(sortSummariesByDate(contract2, contract1)).toBe(1)
    expect(sortSummariesByDate(contract1, contract1)).toBe(0)
  })
})
