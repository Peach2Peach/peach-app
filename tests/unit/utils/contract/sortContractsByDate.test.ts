/* eslint-disable max-lines-per-function */
import { sortContractsByDate } from '../../../../src/utils/contract'

describe('sortContractsByDate', () => {
  test('should return 1, -1 or 0 accordingly when both contracts have paymentConfirmed date', () => {
    const contract1: Partial<TradeSummary> = {
      paymentConfirmed: new Date(2022, 0, 2),
      paymentMade: new Date(2022, 0, 1),
      creationDate: new Date(2022, 0, 1),
    }

    const contract2: Partial<TradeSummary> = {
      paymentConfirmed: new Date(2022, 0, 3),
      paymentMade: new Date(2022, 0, 2),
      creationDate: new Date(2022, 0, 1),
    }
    expect(sortContractsByDate(contract1 as TradeSummary, contract2 as TradeSummary)).toBe(-1)
    expect(sortContractsByDate(contract2 as TradeSummary, contract1 as TradeSummary)).toBe(1)
    expect(sortContractsByDate(contract1 as TradeSummary, contract1 as TradeSummary)).toBe(0)
  })
  test('should return 1, -1 or 0 accordingly when only one contract has paymentConfirmed date', () => {
    const contract1: Partial<TradeSummary> = {
      paymentConfirmed: new Date(2022, 0, 3),
      paymentMade: new Date(2022, 0, 2),
      creationDate: new Date(2022, 0, 1),
    }

    const contract2: Partial<TradeSummary> = {
      paymentConfirmed: undefined,
      paymentMade: new Date(2022, 0, 2),
      creationDate: new Date(2022, 0, 1),
    }
    expect(sortContractsByDate(contract1 as TradeSummary, contract2 as TradeSummary)).toBe(1)
    expect(sortContractsByDate(contract2 as TradeSummary, contract1 as TradeSummary)).toBe(-1)
    expect(sortContractsByDate(contract1 as TradeSummary, contract1 as TradeSummary)).toBe(0)
  })
  test('should return 1, -1 or 0 accordingly when both contracts have paymentMade date', () => {
    const contract1: Partial<TradeSummary> = {
      paymentConfirmed: undefined,
      paymentMade: new Date(2022, 0, 1),
      creationDate: new Date(2022, 0, 1),
    }

    const contract2: Partial<TradeSummary> = {
      paymentConfirmed: undefined,
      paymentMade: new Date(2022, 0, 2),
      creationDate: new Date(2022, 0, 1),
    }
    expect(sortContractsByDate(contract1 as TradeSummary, contract2 as TradeSummary)).toBe(-1)
    expect(sortContractsByDate(contract2 as TradeSummary, contract1 as TradeSummary)).toBe(1)
    expect(sortContractsByDate(contract1 as TradeSummary, contract1 as TradeSummary)).toBe(0)
  })
  test('should return 1, -1 or 0 accordingly when only one contract has paymentMade date', () => {
    const contract1: Partial<TradeSummary> = {
      paymentConfirmed: undefined,
      paymentMade: new Date(2022, 0, 2),
      creationDate: new Date(2022, 0, 1),
    }

    const contract2: Partial<TradeSummary> = {
      paymentConfirmed: undefined,
      paymentMade: undefined,
      creationDate: new Date(2022, 0, 1),
    }
    expect(sortContractsByDate(contract1 as TradeSummary, contract2 as TradeSummary)).toBe(1)
    expect(sortContractsByDate(contract2 as TradeSummary, contract1 as TradeSummary)).toBe(-1)
    expect(sortContractsByDate(contract1 as TradeSummary, contract1 as TradeSummary)).toBe(0)
  })
  test('should return 1, -1 or 0 accordingly when both contracts only have creationDate', () => {
    const contract1: Partial<TradeSummary> = {
      paymentConfirmed: undefined,
      paymentMade: undefined,
      creationDate: new Date(2022, 0, 1),
    }

    const contract2: Partial<TradeSummary> = {
      paymentConfirmed: undefined,
      paymentMade: undefined,
      creationDate: new Date(2022, 0, 2),
    }
    expect(sortContractsByDate(contract1 as TradeSummary, contract2 as TradeSummary)).toBe(-1)
    expect(sortContractsByDate(contract2 as TradeSummary, contract1 as TradeSummary)).toBe(1)
    expect(sortContractsByDate(contract1 as TradeSummary, contract1 as TradeSummary)).toBe(0)
  })
})
