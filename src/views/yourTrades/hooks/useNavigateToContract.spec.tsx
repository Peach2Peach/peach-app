import { act, renderHook, waitFor } from '@testing-library/react-native'
import { contract } from '../../../../tests/unit/data/contractData'
import { NavigationWrapper, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper, queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { OverlayContext, defaultOverlay } from '../../../contexts/overlay'
import { useLocalContractStore } from '../../../store/useLocalContractStore'
import { useNavigateToContract } from './useNavigateToContract'
import { contractSummary } from '../../../../tests/unit/data/contractSummaryData'

let overlay = defaultOverlay
const updateOverlay = jest.fn((newOverlay) => {
  overlay = newOverlay
})

const OverlayWrapper = ({ children }: ComponentProps) => (
  <OverlayContext.Provider value={[overlay, updateOverlay]}>{children}</OverlayContext.Provider>
)

const getContractMock = jest.fn(() => Promise.resolve([contract, null]))
jest.mock('../../../utils/peachAPI', () => ({
  getContract: (..._args: unknown[]) => getContractMock(),
}))

describe('useNavigateToContract', () => {
  const TestWrapper = ({ children }: ComponentProps) => (
    <QueryClientWrapper>
      <NavigationWrapper>
        <OverlayWrapper>{children}</OverlayWrapper>
      </NavigationWrapper>
    </QueryClientWrapper>
  )

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should navigate to the contract', async () => {
    const { result } = renderHook(() => useNavigateToContract(contractSummary), { wrapper: TestWrapper })
    await waitFor(() => expect(queryClient.getQueryState(['contract', contractSummary.id])?.status).toBe('success'))
    await act(async () => {
      await result.current()
    })

    expect(navigateMock).toHaveBeenCalledWith('contract', { contractId: contractSummary.id })
  })
  it('should show the dispute email popup if it has not been seen yet', async () => {
    useLocalContractStore.getState().setContract({ id: 'newContractId', hasSeenDisputeEmailPopup: false })
    getContractMock.mockResolvedValueOnce([{ ...contract, id: 'newContractId', disputeActive: true }, null])
    const { result } = renderHook(() => useNavigateToContract({ ...contractSummary, id: 'newContractId' }), {
      wrapper: TestWrapper,
    })

    await waitFor(() => expect(queryClient.getQueryState(['contract', 'newContractId'])?.status).toBe('success'))

    await act(async () => {
      await result.current()
    })

    await waitFor(() =>
      expect(useLocalContractStore.getState().contracts.newContractId.hasSeenDisputeEmailPopup).toBe(true),
    )
  })
})
