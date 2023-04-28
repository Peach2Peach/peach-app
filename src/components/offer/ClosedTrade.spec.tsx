import { ClosedTrade } from './ClosedTrade'
import { render } from '@testing-library/react-native'

jest.mock('./TradeSeparator', () => ({
  TradeSeparator: 'TradeSeparator',
}))
jest.mock('./CanceledTradeDetails', () => ({
  CanceledTradeDetails: 'CanceledTradeDetails',
}))
jest.mock('./CompletedTradeDetails', () => ({
  CompletedTradeDetails: 'CompletedTradeDetails',
}))
jest.mock('./TradeStuffSeparator', () => ({
  TradeStuffSeparator: 'TradeStuffSeparator',
}))
jest.mock('./TradeStuff', () => ({
  TradeStuff: 'TradeStuff',
}))

describe('ClosedTrade', () => {
  it('should render the won dispute as seller status correctly', () => {
    const contract = {
      disputeWinner: 'seller',
      tradeStatus: 'refundOrReviveRequired',
    }
    const { toJSON } = render(<ClosedTrade contract={contract as Contract} view="seller" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render the refundOrReviveRequired status correctly when there is no disputeWinner', () => {
    const contract = {
      tradeStatus: 'refundOrReviveRequired',
    }
    const { toJSON } = render(<ClosedTrade contract={contract as Contract} view="seller" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render a canceled trade correctly', () => {
    const contract = {
      tradeStatus: 'tradeCanceled',
    }
    const { toJSON } = render(<ClosedTrade contract={contract as Contract} view="seller" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render a completed trade correctly', () => {
    const contract = {
      tradeStatus: 'tradeCompleted',
    }
    const { toJSON } = render(<ClosedTrade contract={contract as Contract} view="seller" />)
    expect(toJSON()).toMatchSnapshot()
  })
})
