import { createRenderer } from 'react-test-renderer/shallow'
import { MatchedOverlay } from './MatchedOverlay'
import { match } from '../../../../tests/unit/data/matchData'
import { buyOffer } from '../../../../tests/unit/data/offerData'

describe('MatchedOverlay', () => {
  const renderer = createRenderer()
  const interruptMatchFunction = jest.fn()
  const setShowMatchedCard = jest.fn()
  it('should render correctly', () => {
    renderer.render(<MatchedOverlay {...{ match, offer: buyOffer, interruptMatchFunction, setShowMatchedCard }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
