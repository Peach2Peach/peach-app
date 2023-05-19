import { createRenderer } from 'react-test-renderer/shallow'
import { WithMatches } from './WithMatches'
import { sellOffer } from '../../../../tests/unit/data/offerData'

describe('WithMatches', () => {
  const shallowRenderer = createRenderer()
  it('renders correctly', () => {
    shallowRenderer.render(<WithMatches offer={sellOffer} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
