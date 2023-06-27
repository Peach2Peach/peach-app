import { MatchCardCounterparty } from './MatchCardCounterparty'
import { createRenderer } from 'react-test-renderer/shallow'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'

describe('MatchCardCounterparty', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<MatchCardCounterparty user={{ id: '123', rating: 1, trades: 21 } as User} />, {
      wrapper: NavigationWrapper,
    })
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for a new user', () => {
    renderer.render(<MatchCardCounterparty user={{ id: '123', rating: 1, trades: 3 } as User} />, {
      wrapper: NavigationWrapper,
    })
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
