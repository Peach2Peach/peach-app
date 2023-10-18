import { render } from 'test-utils'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { Template10 } from './Template10'

jest.mock('../../../../views/contract/helpers')

describe('Template10', () => {
  const mockProps: FormProps = {
    data: { currencies: [], type: 'liquid' },
    onSubmit: jest.fn(),
    setStepValid: jest.fn(),
    setFormData: jest.fn(),
  }

  it('should render correctly', () => {
    expect(render(<Template10 {...mockProps} />)).toMatchSnapshot()
  })
})
