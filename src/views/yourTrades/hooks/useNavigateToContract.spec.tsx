import { act, renderHook, waitFor } from '@testing-library/react-native'
import { contract } from '../../../../tests/unit/data/contractData'
import { NavigationWrapper, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper, queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { OverlayContext, defaultOverlay } from '../../../contexts/overlay'
import { useLocalContractStore } from '../../../store/useLocalContractStore'
import { defaultPopupState, usePopupStore } from '../../../store/usePopupStore'
import { DisputeWon } from '../../../overlays/dispute/components/DisputeWon'
import { account } from '../../../utils/account'
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
    usePopupStore.setState(defaultPopupState)
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
  // it.failing('should show the dispute won popup if the viewer has won the dispute', async () => {
  //   const disputeWonContractSummary = {
  //     amount: 40000,
  //     creationDate: new Date('2023-04-26T12:04:55.915Z'),
  //     currency: 'EUR',
  //     disputeWinner: 'seller',
  //     id: '333-337',
  //     isChatActive: true,
  //     lastModified: new Date('2023-04-27T10:00:47.531Z'),
  //     offerId: '333',
  //     paymentConfirmed: undefined,
  //     paymentMade: undefined,
  //     price: 10.63,
  //     tradeStatus: 'refundOrReviveRequired',
  //     type: 'ask',
  //     unreadMessages: 0,
  //     disputeActive: false,
  //     disputeResolvedDate: new Date('2023-04-27T10:00:47.531Z'),
  //   } as const
  //   getContractMock.mockResolvedValue([
  //     { ...contract, buyer: { ...contract.buyer, id: account.publicKey }, disputeWinner: 'buyer' },
  //     null,
  //   ])
  //   useLocalContractStore.setState({
  //     contracts: { [disputeWonContractSummary.id]: { disputeResultAcknowledged: false } },
  //   } as any)

  //   const { result } = renderHook(() => useNavigateToContract(disputeWonContractSummary), {
  //     wrapper: TestWrapper,
  //   })

  //   await waitFor(() =>
  //     expect(queryClient.getQueryState(['contract', disputeWonContractSummary.id])?.status).toBe('success'),
  //   )

  //   await act(async () => {
  //     await result.current()
  //   })

  //   expect(navigateMock).toHaveBeenCalledWith('contract', { contractId: disputeWonContractSummary.id })

  //   await waitFor(() => {
  //     expect(usePopupStore.getState()).toStrictEqual(
  //       expect.objectContaining({
  //         title: 'dispute won!',
  //         level: 'SUCCESS',
  //         content: <DisputeWon tradeId={'PC‑E‑F'} />,
  //         visible: true,
  //         action2: {
  //           label: 'close',
  //           icon: 'xSquare',
  //           callback: expect.any(Function),
  //         },
  //         action1: {
  //           label: 'go to chat',
  //           icon: 'messageCircle',
  //           callback: expect.any(Function),
  //         },
  //       }),
  //     )
  //   })
  // })
})
