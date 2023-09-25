import { act, renderHook } from '@testing-library/react-native'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { useTemplate9Setup } from './useTemplate9Setup'

describe('useTemplate9Setup', () => {
  const defaultProps: FormProps = {
    data: {
      id: 'id',
      label: 'label',
      type: 'nationalTransferBG',
      accountNumber: 'accountNumber',
      reference: 'reference',
      iban: 'iban',
      bic: 'bic',
      currencies: [],
    },
    onSubmit: jest.fn(),
    setStepValid: jest.fn(),
    setFormData: jest.fn(),
  }
  it('should return the correct values', () => {
    const { result } = renderHook(() => useTemplate9Setup(defaultProps))
    expect(result.current).toMatchSnapshot()
  })
  it('should require a beneficiary', () => {
    const { result } = renderHook(() => useTemplate9Setup(defaultProps))
    act(() => {
      result.current.accountNumberInputProps.onChange('accountNumber')
    })
    expect(result.current.beneficiaryInputProps.errorMessage).toEqual(['this field is required'])
  })
})
