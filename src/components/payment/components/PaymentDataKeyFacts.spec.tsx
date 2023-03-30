import { createRenderer } from 'react-test-renderer/shallow'
import tw from '../../../styles/tailwind'
import { PaymentDataKeyFacts } from './PaymentDataKeyFacts'

describe('PaymentDataKeyFacts', () => {
  const paymentData: PaymentData = {
    id: 'id',
    label: 'Paypal',
    type: 'paypal',
    currencies: ['EUR'],
    userName: '@halfin',
  }
  const paymentData2: PaymentData = {
    ...paymentData,
    currencies: ['EUR', 'CHF', 'GBP', 'PLN'],
  }

  it('should render correctly', () => {
    const renderer = createRenderer()
    renderer.render(<PaymentDataKeyFacts paymentData={paymentData} style={tw`mt-4`} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render multiple currencies, if set', () => {
    const renderer = createRenderer()
    renderer.render(<PaymentDataKeyFacts paymentData={paymentData2} style={tw`mt-4`} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
