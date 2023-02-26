import { getAndUpdateTradingLimit } from '../getAndUpdateTradingLimit'

const getTradingLimitMock = jest.fn().mockResolvedValue(['tradingLimit'])
jest.mock('../../../../../utils/peachAPI', () => ({
  getTradingLimit: () => getTradingLimitMock(),
}))

const updateTradingLimitMock = jest.fn()
jest.mock('../../../../../utils/account', () => ({
  updateTradingLimit: (...args) => updateTradingLimitMock(...args),
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
