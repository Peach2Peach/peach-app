import { getAndUpdateTradingLimit } from '../../../../../src/views/buy/helpers/getAndUpdateTradingLimit'

const getTradingLimitMock = jest.fn().mockResolvedValue(['tradingLimit'])
jest.mock('../../../../../src/utils/peachAPI', () => ({
  getTradingLimit: () => getTradingLimitMock(),
}))

const updateTradingLimitMock = jest.fn()
jest.mock('../../../../../src/utils/account', () => ({
  updateTradingLimit: (...args: any[]) => updateTradingLimitMock(...args),
}))

describe('getAndUpdateTradingLimit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should call getTradingLimit', async () => {
    await getAndUpdateTradingLimit()
    expect(getTradingLimitMock).toHaveBeenCalled()
  })
  it('should call updateTradingLimit if getTradingLimit returns a tradingLimit', async () => {
    await getAndUpdateTradingLimit()
    expect(updateTradingLimitMock).toHaveBeenCalledWith('tradingLimit')
  })

  it('should not call updateTradingLimit if getTradingLimit returns undefined', async () => {
    getTradingLimitMock.mockResolvedValueOnce([undefined])
    await getAndUpdateTradingLimit()
    expect(updateTradingLimitMock).not.toHaveBeenCalled()
  })
})
