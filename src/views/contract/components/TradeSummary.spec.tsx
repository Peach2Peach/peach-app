import { createRenderer } from 'react-test-renderer/shallow'
import { TradeSummary } from './TradeSummary'

const useContractContextMock = jest.fn()
jest.mock('../context', () => ({
  useContractContext: () => useContractContextMock(),
}))

describe('TradeSummary', () => {
  const renderer = createRenderer()
  it('should render correctly for buyer', () => {
    useContractContextMock.mockReturnValueOnce({
      contract: {
        seller: { id: 'seller' },
        buyer: { id: 'buyer' },
        disputeActive: false,
      },
      view: 'buyer',
    })
    renderer.render(<TradeSummary />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for seller', () => {
    useContractContextMock.mockReturnValueOnce({
      contract: {
        seller: { id: 'seller' },
        buyer: { id: 'buyer' },
        disputeActive: false,
      },
      view: 'seller',
    })
    renderer.render(<TradeSummary />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for dispute', () => {
    useContractContextMock.mockReturnValueOnce({
      contract: {
        seller: { id: 'seller' },
        buyer: { id: 'buyer' },
        disputeActive: true,
      },
      view: 'buyer',
    })
    renderer.render(<TradeSummary />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
