import { createRenderer } from 'react-test-renderer/shallow'
import { NoMatchesYet } from './NoMatchesYet'
import { buyOffer, sellOffer } from '../../../../tests/unit/data/offerData'

const useOfferMatchesMock = jest.fn().mockReturnValue({ isLoading: false })
jest.mock('../hooks/useOfferMatches', () => ({
  useOfferMatches: () => useOfferMatchesMock(),
}))

describe('NoMatchesYet', () => {
  const shallowRenderer = createRenderer()
  it('renders correctly for buy offer', () => {
    shallowRenderer.render(<NoMatchesYet offer={buyOffer} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for sell offer', () => {
    shallowRenderer.render(<NoMatchesYet offer={sellOffer} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly while loading', () => {
    useOfferMatchesMock.mockReturnValueOnce({ isLoading: true })
    shallowRenderer.render(<NoMatchesYet offer={buyOffer} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
