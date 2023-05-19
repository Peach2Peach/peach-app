import { createRenderer } from 'react-test-renderer/shallow'
import { buyOffer, sellOffer } from '../../../../tests/unit/data/offerData'
import { MatchesTitle } from './MatchesTitle'

const offerId = sellOffer.id
const useRouteMock = jest.fn(() => ({
  params: {
    offerId,
  },
}))
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const useOfferMatchesMock = jest.fn().mockReturnValue({ allMatches: [] })
jest.mock('../hooks/useOfferMatches', () => ({
  useOfferMatches: () => useOfferMatchesMock(),
}))

describe('MatchesTitle', () => {
  const shallowRenderer = createRenderer()
  const useWindowDimensionsSpy = jest.spyOn(jest.requireActual('react-native'), 'useWindowDimensions')

  it('renders correctly for buy offers', () => {
    useWindowDimensionsSpy.mockReturnValueOnce({ width: 320, height: 620 })

    shallowRenderer.render(<MatchesTitle offer={buyOffer} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for buy offers on medium screens', () => {
    useWindowDimensionsSpy.mockReturnValueOnce({ width: 376, height: 691 })

    shallowRenderer.render(<MatchesTitle offer={buyOffer} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for sell offers', () => {
    useWindowDimensionsSpy.mockReturnValueOnce({ width: 376, height: 691 })

    shallowRenderer.render(<MatchesTitle offer={sellOffer} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
