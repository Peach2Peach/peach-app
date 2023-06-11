import { CurrentOfferAmount } from './CurrentOfferAmount'
import { createRenderer } from 'react-test-renderer/shallow'
import { useOfferPreferences } from '../../../store/offerPreferenes'

describe('CurrentOfferAmount', () => {
  it('should render correctly', () => {
    const renderer = createRenderer()
    useOfferPreferences.setState({ sellAmount: 21000000 })
    renderer.render(<CurrentOfferAmount />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
