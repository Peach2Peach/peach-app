import { render } from '@testing-library/react-native'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { Template21 } from './Template21'

jest.mock('../../../../views/contract/helpers')

describe('Template21', () => {
  const mockProps: FormProps = {
    data: { currencies: ['NGN'], type: 'nationalTransferNG' },
    onSubmit: jest.fn(),
    setStepValid: jest.fn(),
    setFormData: jest.fn(),
  }

  it('should render correctly', () => {
    expect(render(<Template21 {...mockProps} />)).toMatchSnapshot()
  })
})
