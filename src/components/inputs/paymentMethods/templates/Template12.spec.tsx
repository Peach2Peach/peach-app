import { render } from 'test-utils'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { Template12 } from './Template12'

jest.mock('../../../../views/contract/helpers')

describe('Template12', () => {
  const mockProps: FormProps = {
    data: { currencies: ['COP'], type: 'rappipay' },
    onSubmit: jest.fn(),
    setStepValid: jest.fn(),
    setFormData: jest.fn(),
  }

  it('should render correctly', () => {
    expect(render(<Template12 {...mockProps} />)).toMatchSnapshot()
  })
})
