import { render } from 'test-utils'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { Template16 } from './Template16'

jest.mock('../../../../views/contract/helpers')

describe('Template16', () => {
  const mockProps: FormProps = {
    data: { currencies: ['ARS'], type: 'cvu' },
    onSubmit: jest.fn(),
    setStepValid: jest.fn(),
    setFormData: jest.fn(),
  }

  it('should render correctly', () => {
    expect(render(<Template16 {...mockProps} />)).toMatchSnapshot()
  })
})
