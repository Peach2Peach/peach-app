import { render } from '@testing-library/react-native'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { Template20 } from './Template20'

jest.mock('../../../../views/contract/helpers')

describe('Template20', () => {
  const mockProps: FormProps = {
    data: { currencies: ['NGN'], type: 'payday' },
    onSubmit: jest.fn(),
    setStepValid: jest.fn(),
    setFormData: jest.fn(),
  }

  it('should render correctly', () => {
    expect(render(<Template20 {...mockProps} />)).toMatchSnapshot()
  })
})
