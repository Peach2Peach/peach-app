import { create } from 'react-test-renderer'
import { PeachScrollView } from '../../components'
import Search from './Search'
import { createRenderer } from 'react-test-renderer/shallow'

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
    shallowRenderer.render(<Search />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for no matches', () => {
    useSearchSetupMock.mockReturnValueOnce({
      hasMatches: false,
      offer: {},
    })
    shallowRenderer.render(<Search />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('does not bounce', () => {
    const testInstace = create(<Search />).root
    const scrollView = testInstace.findByType(PeachScrollView)
    expect(scrollView.props.bounces).toBe(false)
  })
})
