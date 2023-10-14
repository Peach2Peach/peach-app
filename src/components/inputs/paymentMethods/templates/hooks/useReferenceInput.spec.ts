import { act, renderHook } from 'test-utils'
import { useReferenceInput } from './useReferenceInput'

describe('useReferenceInput', () => {
  const mockData: Partial<PaymentData> = {}
  it('should return the correct defaults', () => {
    const { result } = renderHook(useReferenceInput, { initialProps: mockData })

    expect(result.current).toStrictEqual({
      referenceInputProps: {
        value: '',
        onChange: expect.any(Function),
        errorMessage: undefined,
      },
      reference: '',
      referenceIsValid: true,
      setDisplayErrors: expect.any(Function),
    })
  })

  it('should update the reference', () => {
    const { result } = renderHook(useReferenceInput, { initialProps: mockData })

    act(() => {
      result.current.referenceInputProps.onChange('Use trade id')
    })

    expect(result.current).toStrictEqual({
      referenceInputProps: {
        value: 'Use trade id',
        onChange: expect.any(Function),
        errorMessage: undefined,
      },
      reference: 'Use trade id',
      referenceIsValid: true,
      setDisplayErrors: expect.any(Function),
    })
  })

  it('should show the display errors', () => {
    const { result } = renderHook(useReferenceInput, { initialProps: { reference: 'bitcoin' } })

    act(() => {
      result.current.setDisplayErrors(true)
    })

    expect(result.current).toStrictEqual({
      referenceInputProps: {
        value: 'bitcoin',
        onChange: expect.any(Function),
        errorMessage: ["don't mention bitcoin or peach"],
      },
      reference: 'bitcoin',
      referenceIsValid: false,
      setDisplayErrors: expect.any(Function),
    })
  })
})
