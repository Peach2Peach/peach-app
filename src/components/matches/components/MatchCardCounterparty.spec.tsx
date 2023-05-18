import { MatchCardCounterparty } from './MatchCardCounterparty'
import { createRenderer } from 'react-test-renderer/shallow'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'

describe('MatchCardCounterparty', () => {
  it('renders correctly', () => {
    const renderer = createRenderer()

    renderer.render(<MatchCardCounterparty user={{ id: '123', rating: 1, trades: 21 } as User} />, {
      wrapper: NavigationWrapper,
    })
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
