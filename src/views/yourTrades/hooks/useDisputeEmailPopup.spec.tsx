import { act, renderHook } from '@testing-library/react-native'
import { contract } from '../../../../tests/unit/data/contractData'
import { queryClient as testQueryClient, QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { useLocalContractStore } from '../../../store/useLocalContractStore'
import DisputeRaisedNotice from '../../../popups/dispute/components/DisputeRaisedNotice'
import i18n from '../../../utils/i18n'
import { defaultPopupState, usePopupStore } from '../../../store/usePopupStore'
import { account1 } from '../../../../tests/unit/data/accountData'
import { setAccount } from '../../../utils/account'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useDisputeEmailPopup } from './useDisputeEmailPopup'

const wrapper = ({ children }: ComponentProps) => (
  <QueryClientWrapper>
    <NavigationWrapper>{children}</NavigationWrapper>
  </QueryClientWrapper>
)
const getContractMock = jest.fn().mockResolvedValue([contract, null])
jest.mock('../../../utils/peachAPI', () => ({
  getContract: (..._args: unknown[]) => getContractMock(),
}))

jest.mock('../../../queryClient', () => ({
  queryClient: testQueryClient,
}))

describe('useDisputeEmailPopup', () => {
  beforeEach(() => {
    setAccount({ ...account1, contracts: [] })

    useLocalContractStore.getState().setContract({
      id: contract.id,
      hasSeenDisputeEmailPopup: false,
    })
    usePopupStore.setState(defaultPopupState)
    testQueryClient.clear()
  })

  it('should show the dispute email popup', async () => {
    const contractDisputeInitiatedByCP = { ...contract, disputeInitiator: 'someOtherAccount', disputeActive: true }
    getContractMock.mockResolvedValueOnce([contractDisputeInitiatedByCP, null])
    const { result } = renderHook(() => useDisputeEmailPopup(contract.id), { wrapper })
    await act(async () => {
      await result.current()
    })

    expect(usePopupStore.getState()).toStrictEqual({
      ...usePopupStore.getState(),
      title: i18n('dispute.opened'),
      level: 'WARN',
      closePopup: expect.any(Function),
      content: (
        <DisputeRaisedNotice
          view="seller"
          contract={contractDisputeInitiatedByCP}
          email=""
          setEmail={expect.any(Function)}
          disputeReason={'other'}
          action1={{
            callback: expect.any(Function),
            icon: 'messageCircle',
            label: 'go to chat',
          }}
          action2={{
            callback: expect.any(Function),
            icon: 'xSquare',
            label: 'close',
          }}
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
    const { result } = renderHook(() => useDisputeEmailPopup(contract.id), { wrapper })
    await act(async () => {
      await result.current()
    })

    expect(usePopupStore.getState()).toStrictEqual(expect.objectContaining(defaultPopupState))
  })
  it('should not show the dispute email popup if the user initiated the dispute', async () => {
    useLocalContractStore.getState().setContract({
      id: contract.id,
      hasSeenDisputeEmailPopup: false,
    })
    getContractMock.mockResolvedValueOnce([{ ...contract, disputeActive: true, disputeInitiator: account1.publicKey }])
    const { result } = renderHook(() => useDisputeEmailPopup(contract.id), { wrapper })
    await act(async () => {
      await result.current()
    })

    expect(usePopupStore.getState()).toStrictEqual(expect.objectContaining(defaultPopupState))
  })
  it('should update the queryData', async () => {
    const contractDisputeInitiatedByCP = { ...contract, disputeInitiator: 'someOtherAccount', disputeActive: true }
    getContractMock.mockResolvedValueOnce([contractDisputeInitiatedByCP, null])
    const { result } = renderHook(() => useDisputeEmailPopup(contract.id), { wrapper })
    await act(async () => {
      await result.current()
    })

    expect(testQueryClient.getQueryData(['contract', contract.id])).toStrictEqual({
      ...contractDisputeInitiatedByCP,
      hasSeenDisputeEmailPopup: true,
    })
  })
})
