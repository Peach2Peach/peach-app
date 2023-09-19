import { render } from '@testing-library/react-native'
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { NavigationWrapper as wrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { MatchCardCounterparty } from './MatchCardCounterparty'
expect.extend({ toMatchDiffSnapshot })

describe('MatchCardCounterparty', () => {
  const defaultComponent = <MatchCardCounterparty user={{ id: '123', rating: 1, trades: 21, medals: ['ambassador'] }} />
  it('renders correctly', () => {
    const { toJSON } = render(defaultComponent, {
      wrapper,
    })
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly for a new user', () => {
    const { toJSON } = render(
      <MatchCardCounterparty user={{ id: '123', rating: 1, trades: 2, medals: ['ambassador'] }} />,
      {
        wrapper,
      },
    )
    expect(render(defaultComponent, { wrapper }).toJSON()).toMatchDiffSnapshot(toJSON())
  })
})
