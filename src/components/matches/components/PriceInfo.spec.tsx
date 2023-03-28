import { createRenderer } from 'react-test-renderer/shallow'
import { PriceInfo } from './PriceInfo'

describe('PriceInfo', () => {
  it('should render correctly', () => {
    const matchMock = { amount: 210000, premium: 7 } as Match
    const offerMock = {} as BuyOffer

    const renderer = createRenderer()
    renderer.render(<PriceInfo match={matchMock} offer={offerMock} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
