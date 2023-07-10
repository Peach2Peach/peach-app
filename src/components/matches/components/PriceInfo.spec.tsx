import { createRenderer } from 'react-test-renderer/shallow'
import { buyOffer, matchOffer } from '../../../../tests/unit/data/offerData'
import { PriceInfo } from './PriceInfo'

jest.mock('../../../hooks', () => ({
  useMarketPrices: jest.fn(() => ({
    data: {
      EUR: 400,
    },
    isSuccess: true,
  })),
}))

describe('PriceInfo', () => {
  it('should render correctly', () => {
    const renderer = createRenderer()
    renderer.render(<PriceInfo match={matchOffer} offer={buyOffer} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
