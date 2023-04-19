import { getDefaultFundingStatus } from './getDefaultFundingStatus'

describe('getDefaultFundingStatus', () => {
  it('should return a default funding status', async () => {
    const fundingStatus = await getDefaultFundingStatus()

    expect(fundingStatus.status).toBe('NULL')
    expect(fundingStatus.txIds).toHaveLength(0)
    expect(fundingStatus.vouts).toHaveLength(0)
    expect(fundingStatus.amounts).toHaveLength(0)
    expect(fundingStatus.expiry).toBe(4320)
  })
})
