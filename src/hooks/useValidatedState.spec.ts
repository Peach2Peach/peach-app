import { act } from 'react-test-renderer'
import { renderHook } from 'test-utils'
import { useValidatedState } from '.'

const requiredRule = { required: true }
describe('useValidatedState', () => {
  it('returns state value, setter, isValid, errors and isPristine accordingly', () => {
    const { result } = renderHook(() => useValidatedState('', requiredRule))
    const [value, setValue, valueValid, valueErrors, valuePristine] = result.current
    expect(value).toBe('')
    expect(setValue).toBeInstanceOf(Function)
    expect(valueValid).toBeFalsy()
    expect(valueErrors).toHaveLength(1)
    expect(valuePristine).toBeTruthy()
  })
  it('returns state value, setter, isValid, errors and isPristine with default', () => {
    const { result } = renderHook(() => useValidatedState('default', requiredRule))
    const [value, setValue, valueValid, valueErrors, valuePristine] = result.current
    expect(value).toBe('default')
    expect(setValue).toBeInstanceOf(Function)
    expect(valueValid).toBeTruthy()
    expect(valueErrors).toHaveLength(0)
    expect(valuePristine).toBeFalsy()
  })

  it('updates the state correctly', () => {
    const { result } = renderHook(() => useValidatedState<string>('', requiredRule))
    const [value, setValue] = result.current
    expect(value).toBe('')

    act(() => {
      setValue('newValue')
    })

    expect(result.current[0]).toBe('newValue')
    expect(result.current[2]).toBeTruthy()
    expect(result.current[3]).toHaveLength(0)
    expect(result.current[4]).toBeFalsy()
  })
})
