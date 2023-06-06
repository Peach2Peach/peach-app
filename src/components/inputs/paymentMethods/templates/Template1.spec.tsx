import { createRenderer } from 'react-test-renderer/shallow'
import { FormProps } from '../paymentForms/PaymentMethodForm'
import { Template1 } from './Template1'

/**
 * this bad boy here *slaps mock*
 * prevents a circular dependency during testing
 */
jest.mock('../../../../views/contract/helpers')

describe('Template1', () => {
  const shallowRenderer = createRenderer()
  const formProps: FormProps = {
    data: {
      beneficiary: 'Sat',
      bic: 'AAAA BB CC 123',
      currencies: ['EUR'],
      iban: 'BE68 5390 0754 7034',
      id: 'instantSepa-1685698545356',
      label: 'SEPA instant',
      reference: '',
      type: 'instantSepa',
    },
    currencies: ['EUR'],
    onSubmit: jest.fn(),
    setStepValid: jest.fn(),
    paymentMethod: 'instantSepa',
    setFormData: jest.fn(),
  }
  it('renders correctly', () => {
    shallowRenderer.render(<Template1 {...formProps} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
