import { act, renderHook, waitFor } from '@testing-library/react-native'
import { contract } from '../../../../tests/unit/data/contractData'
import { contractSummary } from '../../../../tests/unit/data/contractSummaryData'
import { NavigationWrapper, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper, queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { DisputeWon } from '../../../popups/dispute/components/DisputeWon'
import { useLocalContractStore } from '../../../store/useLocalContractStore'
import { defaultPopupState, usePopupStore } from '../../../store/usePopupStore'
import { account } from '../../../utils/account'
import { useNavigateToContract } from './useNavigateToContract'

const getContractMock = jest.fn(() => Promise.resolve([contract, null]))
jest.mock('../../../utils/peachAPI', () => ({
  getContract: (..._args: unknown[]) => getContractMock(),
}))

jest.mock('../../../queryClient', () => ({
  queryClient,
}))

describe('useNavigateToContract', () => {
  const wrapper = ({ children }: ComponentProps) => (
    <QueryClientWrapper>
      <NavigationWrapper>{children}</NavigationWrapper>
    </QueryClientWrapper>
  )

  afterEach(() => {
    usePopupStore.setState(defaultPopupState)
  })

  it('should navigate to the contract', async () => {
    const { result } = renderHook(() => useNavigateToContract(contractSummary), { wrapper })
    await act(async () => {
      await result.current()
    })

    expect(navigateMock).toHaveBeenCalledWith('contract', { contractId: contractSummary.id })
  })
  it('should not navigate to the contract if it is not a contract summary', async () => {
    const { result } = renderHook(() => useNavigateToContract({} as any), { wrapper })
    await act(async () => {
      await result.current()
    })

    expect(navigateMock).not.toHaveBeenCalled()
  })
  it('should show the dispute email popup if it has not been seen yet', async () => {
    useLocalContractStore.getState().setContract({ id: 'newContractId', hasSeenDisputeEmailPopup: false })
    getContractMock.mockResolvedValueOnce([{ ...contract, id: 'newContractId', disputeActive: true }, null])
    const { result } = renderHook(() => useNavigateToContract({ ...contractSummary, id: 'newContractId' }), {
      wrapper,
    })

    await act(async () => {
      await result.current()
    })

    await waitFor(() =>
      expect(useLocalContractStore.getState().contracts.newContractId.hasSeenDisputeEmailPopup).toBe(true),
    )
  })
  it('should show the dispute won popup if the viewer has won the dispute', async () => {
    const disputeWonContractSummary = {
      amount: 40000,
      creationDate: new Date('2023-04-26T12:04:55.915Z'),
      currency: 'EUR',
      disputeWinner: 'seller',
      id: '333-337',
      isChatActive: true,
      lastModified: new Date('2023-04-27T10:00:47.531Z'),
      offerId: '333',
      paymentConfirmed: undefined,
      paymentMade: undefined,
      price: 10.63,
      tradeStatus: 'refundOrReviveRequired',
      type: 'ask',
      unreadMessages: 0,
      disputeActive: false,
      disputeResolvedDate: new Date('2023-04-27T10:00:47.531Z'),
    } as const
    getContractMock.mockResolvedValue([
      {
        ...contract,
        buyer: { ...contract.buyer, id: account.publicKey },
        disputeWinner: 'buyer',
        disputeActive: false,
        disputeResolvedDate: new Date('2023-04-27T10:00:47.531Z'),
      },
      null,
    ])
    useLocalContractStore.setState({
      contracts: { [disputeWonContractSummary.id]: { disputeResultAcknowledged: false } },
    } as any)

    const { result } = renderHook(() => useNavigateToContract(disputeWonContractSummary), {
      wrapper,
    })
    await act(async () => {
      await result.current()
    })

    expect(navigateMock).toHaveBeenCalledWith('contract', { contractId: disputeWonContractSummary.id })

    await waitFor(() => {
      expect(usePopupStore.getState()).toStrictEqual(
        expect.objectContaining({
          title: 'dispute won!',
          level: 'SUCCESS',
          content: <DisputeWon tradeId={'PC‑E‑F'} />,
          visible: true,
          action2: {
            label: 'close',
            icon: 'xSquare',
            callback: expect.any(Function),
          },
          action1: {
            label: 'go to chat',
            icon: 'messageCircle',
            callback: expect.any(Function),
          },
        }),
      )
    })
  })
})
