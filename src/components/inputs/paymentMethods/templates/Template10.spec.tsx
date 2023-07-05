import { Template10 } from './Template10'
import { render } from '@testing-library/react-native'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'

jest.mock('../../../../views/contract/helpers')

describe('Template10', () => {
  const mockProps: FormProps = {
    data: {},
    currencies: [],
    onSubmit: jest.fn(),
    setStepValid: jest.fn(),
    paymentMethod: 'liquid',
    setFormData: jest.fn(),
  }

  it('should render correctly', () => {
    expect(render(<Template10 {...mockProps} />)).toMatchSnapshot()
  })
})