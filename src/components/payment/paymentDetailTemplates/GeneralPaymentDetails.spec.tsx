import { createRenderer } from 'react-test-renderer/shallow'
import { GeneralPaymentDetails } from './GeneralPaymentDetails'

describe('GeneralPaymentDetails', () => {
  it('should render sepa data', () => {
    const paymentData: SEPAData & Partial<PaymentData> = {
      beneficiary: 'Hal Finney',
      iban: 'IE29 AIBK 9311 5212 3456 78',
      bic: 'AAAABBCC',
    }
    const renderer = createRenderer()
    renderer.render(<GeneralPaymentDetails paymentMethod="sepa" paymentData={paymentData as PaymentData} />)

    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
