import { act, renderHook } from '@testing-library/react-native'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { useTemplate9Setup } from './useTemplate9Setup'

describe('useTemplate9Setup', () => {
  const setStepValidMock = jest.fn()
  const defaultProps: FormProps = {
    data: {
      id: 'id',
      label: 'National Transfer Switzerland',
      type: 'nationalTransferCH',
      accountNumber: '',
      reference: '',
      iban: '',
      bic: '',
      currencies: [],
    },
    onSubmit: jest.fn(),
    setStepValid: setStepValidMock,
    setFormData: jest.fn(),
  }
  it('should return the correct values', () => {
    const { result } = renderHook(() => useTemplate9Setup(defaultProps))
    expect(result.current).toMatchSnapshot()
  })
  it('should require a beneficiary', () => {
    const { result } = renderHook(() => useTemplate9Setup(defaultProps))
    act(() => {
      result.current.accountNumberInputProps.onChange('75317531')
    })
    expect(result.current.beneficiaryInputProps.errorMessage).toEqual(['this field is required'])
    expect(setStepValidMock).toHaveBeenLastCalledWith(false)
  })
})
