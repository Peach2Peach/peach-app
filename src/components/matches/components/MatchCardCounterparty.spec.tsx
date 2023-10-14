import { toMatchDiffSnapshot } from 'snapshot-diff'
import { render } from 'test-utils'
import { MatchCardCounterparty } from './MatchCardCounterparty'
expect.extend({ toMatchDiffSnapshot })

describe('MatchCardCounterparty', () => {
  const defaultComponent = <MatchCardCounterparty user={{ id: '123', rating: 1, trades: 21, medals: ['ambassador'] }} />
  it('renders correctly', () => {
    const { toJSON } = render(defaultComponent)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly for a new user', () => {
    const { toJSON } = render(
      <MatchCardCounterparty user={{ id: '123', rating: 1, trades: 2, medals: ['ambassador'] }} />,
    )
    expect(render(defaultComponent).toJSON()).toMatchDiffSnapshot(toJSON())
  })
})
