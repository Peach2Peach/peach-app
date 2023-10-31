import { render } from 'test-utils'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { Template14 } from './Template14'

jest.mock('../../../../views/contract/helpers')

describe('Template14', () => {
  const mockProps: FormProps = {
    data: { currencies: ['ARS'], type: 'cbu' },
    onSubmit: jest.fn(),
    setStepValid: jest.fn(),
    setFormData: jest.fn(),
  }

  it('should render correctly', () => {
    expect(render(<Template14 {...mockProps} />)).toMatchSnapshot()
  })
})
