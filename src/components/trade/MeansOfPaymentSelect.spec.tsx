import { createRenderer } from 'react-test-renderer/shallow'
import { buyOffer } from '../../../tests/unit/data/offerData'
import { MeansOfPaymentSelect } from './MeansOfPaymentSelect'

describe('MeansOfPaymentSelect', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<MeansOfPaymentSelect meansOfPayment={buyOffer.meansOfPayment} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
