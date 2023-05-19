import { createRenderer } from 'react-test-renderer/shallow'
import { match } from '../../../tests/unit/data/matchData'
import { buyOffer, sellOffer } from '../../../tests/unit/data/offerData'
import { Match } from './Match'
import { useMatchStore } from './store'

const useMatchOfferMock = jest.fn().mockReturnValue({ mutate: jest.fn() })
jest.mock('./hooks/useMatchOffer', () => ({
  useMatchOffer: () => useMatchOfferMock(),
}))

describe('Match', () => {
  const shallowRenderer = createRenderer()
  const matchOffer = jest.fn()
  const defaultProps = {
    matchId: 'matchId',
    matchOffer,
    optionName: 'matchOffer' as const,
  }

  beforeEach(() => {
    useMatchStore.setState((state) => ({
      ...state,
      matchSelectors: {
        [defaultProps.matchId]: {
          showMissingPaymentMethodWarning: false,
        },
      },
    }))
  })
  it('should render correctly for buy offer', () => {
    shallowRenderer.render(<Match match={match} offer={buyOffer} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for buy offer that matched', () => {
    shallowRenderer.render(<Match match={{ ...match, matched: true }} offer={buyOffer} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for sell offer', () => {
    shallowRenderer.render(<Match match={match} offer={sellOffer} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
