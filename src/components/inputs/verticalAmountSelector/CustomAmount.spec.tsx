import { createRenderer } from 'react-test-renderer/shallow'
import { CustomAmount } from './CustomAmount'

describe('CustomAmount', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(
      <CustomAmount
        {...{
          amount: 50000,
          setAmount: jest.fn(),
          fiatPrice: 13.3,
          setCustomFiatPrice: jest.fn(),
          bitcoinPrice: 26600,
          displayCurrency: 'EUR',
        }}
      />,
    )
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
