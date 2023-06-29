import { feeEstimates } from '../../../tests/unit/data/electrumData'
import { getETAInBlocks } from './getETAInBlocks'

describe('getETAInBlocks', () => {
  it('should return the number of blocks that are needed to be mined before the tx confirms', () => {
    expect(getETAInBlocks(1, feeEstimates)).toBe(1008)
    expect(getETAInBlocks(11, feeEstimates)).toBe(144)
    expect(getETAInBlocks(12, feeEstimates)).toBe(18)
    expect(getETAInBlocks(26, feeEstimates)).toBe(1)
  })
})
