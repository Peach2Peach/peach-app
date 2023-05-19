import { createRenderer } from 'react-test-renderer/shallow'
import { buyOffer } from '../../../tests/unit/data/offerData'
import { PaymentMethodsSummary } from './PaymentMethodsSummary'

describe('PaymentMethodsSummary', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<PaymentMethodsSummary meansOfPayment={buyOffer.meansOfPayment} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
