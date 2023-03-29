import { renderHook } from '@testing-library/react-hooks'
import { contract } from '../../../tests/unit/data/contractData'
import { queryClientWrapper } from '../../../tests/unit/helpers/queryClientWrapper'
import { useContractDetails } from './useContractDetails'

const getStoredContractMock = jest.fn()
jest.mock('../../utils/contract', () => ({
  getContract: () => getStoredContractMock(),
}))
const getContractMock = jest.fn().mockResolvedValue([contract])
jest.mock('../../utils/peachAPI', () => ({
  getContract: () => getContractMock(),
}))
const useIsFocusedMock = jest.fn().mockReturnValue(true)
jest.mock('@react-navigation/native', () => ({
  useIsFocused: () => useIsFocusedMock(),
}))

describe('useContractDetails', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('fetches contract details from API', async () => {
    const { result, waitFor } = renderHook((id) => useContractDetails(id), {
      wrapper: queryClientWrapper,
      initialProps: contract.id,
    })

    expect(result.current.contract).toBeUndefined()
    expect(result.current.isLoading).toBeTruthy()

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.contract).toEqual(contract)
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.refetch).toBeInstanceOf(Function)
    expect(result.current.error).toBeFalsy()
  })
  it('returns local contract first if given', async () => {
    const localContract = { ...contract, symmetricKey: 'local' }
    getStoredContractMock.mockReturnValueOnce(localContract)
    const { result, waitFor } = renderHook((id) => useContractDetails(id), {
      wrapper: queryClientWrapper,
      initialProps: contract.id,
    })

    expect(result.current.contract).toEqual(localContract)
    expect(result.current.isLoading).toBeFalsy()

    await waitFor(() => expect(result.current.isFetching).toBe(false))

    expect(result.current.contract).toEqual(contract)
  })
  it('returns local contract if given and server did not return result', async () => {
    const localContract = { ...contract, symmetricKey: 'local' }
    getContractMock.mockResolvedValueOnce([null])
    getStoredContractMock.mockReturnValueOnce(localContract)
    const { result, waitFor } = renderHook((id) => useContractDetails(id), {
      wrapper: queryClientWrapper,
      initialProps: contract.id,
    })

    expect(result.current.contract).toEqual(localContract)
    expect(result.current.isLoading).toBeFalsy()

    await waitFor(() => expect(result.current.isFetching).toBe(false))
    expect(result.current.contract).toEqual(localContract)
  })
})
