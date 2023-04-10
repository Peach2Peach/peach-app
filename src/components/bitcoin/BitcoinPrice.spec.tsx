import ShallowRenderer from 'react-test-renderer/shallow'
import tw from '../../styles/tailwind'
import { BitcoinPrice } from './BitcoinPrice'

const useMarketPricesMock = jest.fn().mockReturnValue({
  data: {
    EUR: 20000,
    CHF: 20000,
  },
})
jest.mock('../../hooks/query/useMarketPrices', () => ({
  useMarketPrices: () => useMarketPricesMock(),
}))

describe('BitcoinPrice', () => {
  const renderer = ShallowRenderer.createRenderer()

  it('should render correctly', () => {
    renderer.render(<BitcoinPrice sats={21000000} />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
  it('should accept style object', () => {
    renderer.render(<BitcoinPrice sats={21000000} style={tw`mt-4`} />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
})
