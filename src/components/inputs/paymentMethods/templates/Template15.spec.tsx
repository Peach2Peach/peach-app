import { render } from 'test-utils'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { Template15 } from './Template15'

jest.mock('../../../../views/contract/helpers')

describe('Template15', () => {
  const mockProps: FormProps = {
    data: { currencies: ['ARS'], type: 'cvu' },
    onSubmit: jest.fn(),
    setStepValid: jest.fn(),
    setFormData: jest.fn(),
  }

  it('should render correctly', () => {
    expect(render(<Template15 {...mockProps} />)).toMatchSnapshot()
  })
})
