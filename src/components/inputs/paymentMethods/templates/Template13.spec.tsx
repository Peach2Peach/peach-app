import { render } from 'test-utils'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { Template13 } from './Template13'

jest.mock('../../../../views/contract/helpers')

describe('Template13', () => {
  const mockProps: FormProps = {
    data: { currencies: ['COP'], type: 'rappipay' },
    onSubmit: jest.fn(),
    setStepValid: jest.fn(),
    setFormData: jest.fn(),
  }

  it('should render correctly', () => {
    expect(render(<Template13 {...mockProps} />)).toMatchSnapshot()
  })
})
