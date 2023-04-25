import { useDisputeEmailPopup } from './useDisputeEmailPopup'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { NavigationContext } from '@react-navigation/native'
import { contract } from '../../../../tests/unit/data/contractData'
import { defaultOverlay, OverlayContext } from '../../../contexts/overlay'
import { queryClient, QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { useLocalContractStore } from '../../../store/useLocalContractStore'
import DisputeRaisedNotice from '../../../overlays/dispute/components/DisputeRaisedNotice'
import i18n from '../../../utils/i18n'

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

describe('useDisputeEmailPopup', () => {
  const TestWrapper = ({ children }) => (
    <QueryClientWrapper>
      <NavigationWrapper>
        <OverlayWrapper>{children}</OverlayWrapper>
      </NavigationWrapper>
    </QueryClientWrapper>
  )

  beforeEach(() => {
    jest.clearAllMocks()
    overlay = defaultOverlay
    useLocalContractStore.getState().setContract({
      id: contract.id,
      hasSeenDisputeEmailPopup: false,
    })
    queryClient.clear()
  })

  it('should show the dispute email popup', async () => {
    getContractMock.mockResolvedValueOnce([{ ...contract, disputeActive: true }, null])
    const { result } = renderHook(() => useDisputeEmailPopup(contract.id), { wrapper: TestWrapper })
    await waitFor(() => {
      expect(queryClient.getQueryState(['contract', contract.id])?.status).toBe('success')
    })
    await act(async () => {
      await result.current()
    })

    expect(overlay).toStrictEqual({
      title: i18n('dispute.opened'),
      level: 'WARN',
      content: (
        <DisputeRaisedNotice
          submit={expect.any(Function)}
          view="buyer"
          contract={{ ...contract, disputeActive: true }}
          email=""
          setEmail={expect.any(Function)}
          emailErrors={['this field is required', 'email is not valid']}
          disputeReason={'other'}
        />
      ),
      visible: true,
      action2: {
        label: i18n('close'),
        icon: 'xSquare',
        callback: expect.any(Function),
      },
      action1: {
        icon: 'messageCircle',
        label: 'go to chat',
        callback: expect.any(Function),
      },
    })
  })

  it('should not show the dispute email popup if the user has already seen it', async () => {
    useLocalContractStore.getState().setContract({
      id: contract.id,
      hasSeenDisputeEmailPopup: true,
    })
    const { result } = renderHook(() => useDisputeEmailPopup(contract.id), { wrapper: TestWrapper })
    await waitFor(() => {
      expect(queryClient.getQueryState(['contract', contract.id])?.status).toBe('success')
    })
    await act(async () => {
      await result.current()
    })

    expect(overlay).toStrictEqual(defaultOverlay)
  })
})
