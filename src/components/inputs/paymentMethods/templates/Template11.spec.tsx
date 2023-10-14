import { render } from 'test-utils'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { Template11 } from './Template11'

jest.mock('../../../../views/contract/helpers')

describe('Template11', () => {
  const mockProps: FormProps = {
    data: { currencies: ['SAT'], type: 'lnurl' },
    onSubmit: jest.fn(),
    setStepValid: jest.fn(),
    setFormData: jest.fn(),
  }

  it('should render correctly', () => {
    expect(render(<Template11 {...mockProps} />)).toMatchSnapshot()
  })
})
