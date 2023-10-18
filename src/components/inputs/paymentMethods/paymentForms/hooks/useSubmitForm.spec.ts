import { act, renderHook } from 'test-utils'
import { useSubmitForm } from './useSubmitForm'

describe('usePaymentMethodFormSetup', () => {
  const paymentData: PaymentData = {
    id: 'id',
    label: 'label',
    type: 'sepa',
    currencies: ['EUR'],
  }
  const onSubmitMock = jest.fn()

  afterEach(() => {
    jest.resetAllMocks()
  })
  it('returns default correct values', () => {
    const { result } = renderHook(() => useSubmitForm(onSubmitMock))
    expect(result.current.submitForm).toBeInstanceOf(Function)
    expect(result.current.stepValid).toBeFalsy()
    expect(result.current.setStepValid).toBeInstanceOf(Function)
  })

  it('sets step valid', () => {
    const { result } = renderHook(() => useSubmitForm(onSubmitMock))

    expect(result.current.stepValid).toBeFalsy()
    act(() => {
      result.current.setStepValid(true)
    })
    expect(result.current.stepValid).toBeTruthy()
  })
  it('does not submit if step is not valid', () => {
    const { result } = renderHook(() => useSubmitForm(onSubmitMock))

    act(() => {
      result.current.submitForm()
    })
    expect(onSubmitMock).not.toHaveBeenCalled()
  })
  it('does submit if step is valid', () => {
    const { result } = renderHook(() => useSubmitForm(onSubmitMock))

    act(() => {
      result.current.setFormData(paymentData)
      result.current.setStepValid(true)
    })
    act(() => {
      result.current.submitForm()
    })
    expect(onSubmitMock).toHaveBeenCalledWith(paymentData)
  })
})
