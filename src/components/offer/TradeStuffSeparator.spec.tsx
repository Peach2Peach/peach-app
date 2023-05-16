import { TradeStuffSeparator } from './TradeStuffSeparator'
import { createRenderer } from 'react-test-renderer/shallow'

jest.mock('../../views/contract/context', () => ({
  useContractContext: jest
    .fn()
    .mockReturnValueOnce({ contract: { disputeActive: false } })
    .mockReturnValueOnce({ contract: { disputeActive: true } }),
}))

describe('TradeStuffSeparator', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<TradeStuffSeparator />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when the dispute is active', () => {
    renderer.render(<TradeStuffSeparator />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
