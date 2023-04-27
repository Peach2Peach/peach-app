import { useNavigateToContract } from './useNavigateToContract'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { NavigationContext } from '@react-navigation/native'
import { defaultOverlay, OverlayContext } from '../../../contexts/overlay'
import { queryClient, QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { contract } from '../../../../tests/unit/data/contractData'
import { useLocalContractStore } from '../../../store/useLocalContractStore'

const navigateMock = jest.fn()
const NavigationWrapper = ({ children }) => (
  <NavigationContext.Provider
    value={{ navigate: navigateMock, isFocused: () => true, addListener: jest.fn(() => jest.fn()) }}
  >
    {children}
  </NavigationContext.Provider>
)

let overlay = defaultOverlay
const updateOverlay = jest.fn((newOverlay) => {
  overlay = newOverlay
})

const OverlayWrapper = ({ children }) => (
  <OverlayContext.Provider value={[overlay, updateOverlay]}>{children}</OverlayContext.Provider>
)

const getContractMock = jest.fn(() => Promise.resolve([contract, null]))
jest.mock('../../../utils/peachAPI', () => ({
  getContract: (..._args: unknown[]) => getContractMock(),
}))

describe('useNavigateToContract', () => {
  const TestWrapper = ({ children }) => (
    <QueryClientWrapper>
      <NavigationWrapper>
        <OverlayWrapper>{children}</OverlayWrapper>
      </NavigationWrapper>
    </QueryClientWrapper>
  )

  const defaultContractSummary: ContractSummary = {
    id: 'contractId',
    offerId: 'offerId',
    type: 'bid',
    creationDate: new Date('2021-01-01'),
    lastModified: new Date('2021-01-01'),
    tradeStatus: 'dispute',
    amount: 21000,
    price: 21,
    currency: 'EUR',
    unreadMessages: 0,
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should navigate to the contract', async () => {
    const { result } = renderHook(() => useNavigateToContract(defaultContractSummary), { wrapper: TestWrapper })
    await waitFor(() =>
      expect(queryClient.getQueryState(['contract', defaultContractSummary.id])?.status).toBe('success'),
    )
    await act(async () => {
      await result.current()
    })

    expect(navigateMock).toHaveBeenCalledWith('contract', { contractId: defaultContractSummary.id })
  })
  it('should show the dispute email popup if it has not been seen yet', async () => {
    useLocalContractStore.getState().setContract({ id: 'newContractId', hasSeenDisputeEmailPopup: false })
    getContractMock.mockResolvedValueOnce([{ ...contract, id: 'newContractId', disputeActive: true }, null])
    const { result } = renderHook(() => useNavigateToContract({ ...defaultContractSummary, id: 'newContractId' }), {
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
