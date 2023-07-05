import { createRenderer } from 'react-test-renderer/shallow'
import { AddressSummaryItem } from './AddressSummaryItem'

describe('AddressSummaryItem', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(
      <AddressSummaryItem title="to" address="bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh" />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when no address is passed', () => {
    renderer.render(<AddressSummaryItem title="to" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
