import { create } from 'react-test-renderer'
import { PeachScrollView } from '../../components'
import Search from './Search'
import { createRenderer } from 'react-test-renderer/shallow'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { QueryClientWrapper } from '../../../tests/unit/helpers/QueryClientWrapper'

const useIsFocusedMock = jest.fn().mockReturnValue(true)
jest.mock('@react-navigation/native', () => ({
  useIsFocused: () => useIsFocusedMock(),
}))

const offerId = sellOffer.id
const useRouteMock = jest.fn(() => ({
  params: { offerId },
}))
jest.mock('../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const useSearchSetupMock = jest.fn().mockReturnValue({
  hasMatches: true,
  offer: {},
})
jest.mock('./hooks/useSearchSetup', () => ({
  useSearchSetup: () => useSearchSetupMock(),
}))
jest.mock('../../components/matches', () => ({
  Matches: () => <></>,
}))

jest.mock('../settings/profile/DailyTradingLimit', () => ({
  DailyTradingLimit: () => <></>,
}))

describe('Search', () => {
  const shallowRenderer = createRenderer()
  it('renders correctly for matches', () => {
    shallowRenderer.render(<Search />, { wrapper: QueryClientWrapper })
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for no matches', () => {
    useSearchSetupMock.mockReturnValueOnce({
      hasMatches: false,
      offer: {},
    })
    shallowRenderer.render(<Search />, { wrapper: QueryClientWrapper })
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('does not bounce', () => {
    const testInstace = create(
      <QueryClientWrapper>
        <Search />
      </QueryClientWrapper>,
    ).root
    const scrollView = testInstace.findByType(PeachScrollView)
    expect(scrollView.props.bounces).toBe(false)
  })
})
