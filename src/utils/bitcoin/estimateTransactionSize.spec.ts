import { estimateTransactionSize } from './estimateTransactionSize'

describe('estimateTransactionSize', () => {
  it('returns an estimated transaction size based on input numbers and outputs', () => {
    expect(estimateTransactionSize(1, 3)).toEqual(216.5)
    expect(estimateTransactionSize(2, 3)).toEqual(284.5)
    expect(estimateTransactionSize(1, 4)).toEqual(262.5)
  })
})
