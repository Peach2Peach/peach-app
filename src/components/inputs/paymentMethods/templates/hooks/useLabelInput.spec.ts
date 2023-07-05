import { useLabelInput } from './useLabelInput'
import { act, renderHook } from '@testing-library/react-native'
import { account, updateAccount } from '../../../../../utils/account'

describe('useLabelInput', () => {
  const mockData: Partial<PaymentData> = {}
  it('should return the correct defaults', () => {
    const { result } = renderHook(useLabelInput, { initialProps: mockData })

    expect(result.current).toStrictEqual({
      labelInputProps: {
        value: '',
        onChange: expect.any(Function),
        errorMessage: undefined,
      },
      label: '',
      setDisplayErrors: expect.any(Function),
      labelErrors: ['this field is required'],
    })
  })

  it('should update the label', () => {
    const { result } = renderHook(useLabelInput, { initialProps: mockData })

    act(() => {
      result.current.labelInputProps.onChange('newLabel')
    })

    expect(result.current).toStrictEqual({
      labelInputProps: {
        value: 'newLabel',
        onChange: expect.any(Function),
        errorMessage: undefined,
      },
      label: 'newLabel',
      setDisplayErrors: expect.any(Function),
      labelErrors: [],
    })
  })

  it('should show the display errors', () => {
    const { result } = renderHook(useLabelInput, { initialProps: mockData })

    act(() => {
      result.current.setDisplayErrors(true)
    })

    expect(result.current).toStrictEqual({
      labelInputProps: {
        value: '',
        onChange: expect.any(Function),
        errorMessage: ['this field is required'],
      },
      label: '',
      setDisplayErrors: expect.any(Function),
      labelErrors: ['this field is required'],
    })
  })

  it('should prevent duplicates', () => {
    updateAccount({
      ...account,
      paymentData: [{ label: 'existingLabel', id: 'existingID', currencies: [], type: 'sepa' }],
    })

    const { result } = renderHook(useLabelInput, { initialProps: mockData })

    act(() => {
      result.current.labelInputProps.onChange('existingLabel')
    })

    expect(result.current.labelErrors).toStrictEqual(['already exists'])
  })
})