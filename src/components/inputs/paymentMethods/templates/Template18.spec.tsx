import { render } from 'test-utils'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { Template18 } from './Template18'

jest.mock('../../../../views/contract/helpers')

describe('Template18', () => {
  const mockProps: FormProps = {
    data: { currencies: ['NGN'], type: 'chippercash' },
    onSubmit: jest.fn(),
    setStepValid: jest.fn(),
    setFormData: jest.fn(),
  }

  it('should render correctly', () => {
    expect(render(<Template18 {...mockProps} />)).toMatchSnapshot()
  })
})
