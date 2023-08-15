import { render } from '@testing-library/react-native'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { Template19 } from './Template19'

jest.mock('../../../../views/contract/helpers')

describe('Template19', () => {
  const mockProps: FormProps = {
    data: { currencies: ['NGN'], type: 'eversend' },
    onSubmit: jest.fn(),
    setStepValid: jest.fn(),
    setFormData: jest.fn(),
  }

  it('should render correctly', () => {
    expect(render(<Template19 {...mockProps} />)).toMatchSnapshot()
  })
})
