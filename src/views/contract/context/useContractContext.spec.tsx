import { renderHook } from '@testing-library/react-native'
import { ContractContext } from '.'
import { useContractContext } from './useContractContext'

const toggleShowBatchInfo = jest.fn()
const wrapper = ({ children }: ComponentProps) => (
  <ContractContext.Provider
    value={{ contract: {} as Contract, view: 'buyer', showBatchInfo: false, toggleShowBatchInfo }}
  >
    {children}
  </ContractContext.Provider>
)
describe('useContractContext', () => {
  it('should return the default values', () => {
    const { result } = renderHook(useContractContext, { wrapper })
    expect(result.current).toEqual({
      contract: {},
      view: 'buyer',
      showBatchInfo: false,
      toggleShowBatchInfo,
    })
  })
  it('should throw an error if used outside of a ContractContext', () => {
    jest.spyOn(console, 'error').mockImplementationOnce(() => null)
    expect(() => renderHook(useContractContext)).toThrow(
      'useContractContext must be used within a ContractContextProvider',
    )
  })
})
