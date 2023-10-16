import { render } from 'test-utils'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { Template17 } from './Template17'

jest.mock('../../../../views/contract/helpers')

describe('Template17', () => {
  const mockProps: FormProps = {
    data: { currencies: ['COP'], type: 'bancolombia' },
    onSubmit: jest.fn(),
    setStepValid: jest.fn(),
    setFormData: jest.fn(),
  }

  it('should render correctly', () => {
    expect(render(<Template17 {...mockProps} />)).toMatchSnapshot()
  })
})
