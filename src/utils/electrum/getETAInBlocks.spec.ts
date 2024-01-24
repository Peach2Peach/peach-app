import { feeEstimates } from '../../../tests/unit/data/electrumData'
import { getETAInBlocks } from './getETAInBlocks'

describe('getETAInBlocks', () => {
  it('should return the number of blocks that are needed to be mined before the tx confirms', () => {
    const feeRate1 = 1
    const expectedETA1 = 1008
    expect(getETAInBlocks(feeRate1, feeEstimates)).toBe(expectedETA1)
    const feeRate2 = 11
    const expectedETA2 = 144
    expect(getETAInBlocks(feeRate2, feeEstimates)).toBe(expectedETA2)
    const feeRate3 = 12
    const expectedETA3 = 18
    expect(getETAInBlocks(feeRate3, feeEstimates)).toBe(expectedETA3)
    const feeRate4 = 26
    const expectedETA4 = 1
    expect(getETAInBlocks(feeRate4, feeEstimates)).toBe(expectedETA4)
  })
})
