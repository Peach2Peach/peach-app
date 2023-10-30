import { renderHook, waitFor } from 'test-utils'
import { contract } from '../../../tests/unit/data/contractData'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { useContractDetails } from './useContractDetails'

const getContractMock = jest.fn().mockResolvedValue([contract])
jest.mock('../../utils/peachAPI', () => ({
  getContract: () => getContractMock(),
}))

describe('useContractDetails', () => {
  afterEach(() => {
    queryClient.clear()
  })
  it('fetches contract details from API', async () => {
    const { result } = renderHook(useContractDetails, { initialProps: contract.id })

    expect(result.current.contract).toBeUndefined()
    expect(result.current.isLoading).toBeTruthy()

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.contract).toEqual(contract)
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.refetch).toBeInstanceOf(Function)
    expect(result.current.error).toBeFalsy()
  })
  it('returns error if server did not return result and no local contract exists', async () => {
    getContractMock.mockResolvedValueOnce([null])
    const { result } = renderHook(useContractDetails, { initialProps: contract.id })

    expect(result.current.contract).toBeUndefined()
    expect(result.current.isLoading).toBeTruthy()

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.contract).toBeUndefined()
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.error).toBeTruthy()
  })
})
