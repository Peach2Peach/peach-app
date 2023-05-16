import { useContractContext } from './useContractContext'
import { renderHook } from '@testing-library/react-native'
import { ContractContext } from '.'

const wrapper = ({ children }: ComponentProps) => (
  <ContractContext.Provider value={{ contract: {} as Contract, view: 'buyer' }}>{children}</ContractContext.Provider>
)
describe('useContractContext', () => {
  it('should return the default values', () => {
    const { result } = renderHook(useContractContext, { wrapper })
    expect(result.current).toEqual({
      contract: {},
      view: 'buyer',
    })
  })
  it('should throw an error if used outside of a ContractContext', () => {
    expect(() => renderHook(useContractContext)).toThrow(
      'useContractContext must be used within a ContractContextProvider',
    )
  })
})
