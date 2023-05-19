import { createRenderer } from 'react-test-renderer/shallow'
import { CustomAmount } from './CustomAmount'

const useBitcoinPricesMock = jest.fn().mockReturnValue({
  displayCurrency: 'EUR',
  fullDisplayPrice: 26600,
})
jest.mock('../../../hooks', () => ({
  useBitcoinPrices: () => useBitcoinPricesMock(),
}))

describe('CustomAmount', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<CustomAmount {...{ amount: 50000, onChange: jest.fn() }} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
