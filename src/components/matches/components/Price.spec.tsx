import { createRenderer } from 'react-test-renderer/shallow'
import { Price } from './Price'
import { match } from '../../../../tests/unit/data/matchData'
import { buyOffer } from '../../../../tests/unit/data/offerData'

describe('Price', () => {
  const renderer = createRenderer()
  it('should render correctly', () => {
    renderer.render(<Price {...{ match, offer: buyOffer }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
