import { act, renderHook, waitFor } from 'test-utils'
import { contractSummary } from '../../../../tests/unit/data/contractSummaryData'
import { defaultSelfUser } from '../../../../tests/unit/data/userData'
import { NavigationAndQueryClientWrapper } from '../../../../tests/unit/helpers/CustomWrapper'
import { headerState } from '../../../../tests/unit/helpers/NavigationWrapper'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { TurnOffBatching } from '../../../popups/app/TurnOffBatching'
import { useTradeSummaryStore } from '../../../store/tradeSummaryStore'
import { usePopupStore } from '../../../store/usePopupStore'
import { useTransactionBatchingSetup } from './useTransactionBatchingSetup'

const getSelfUserMock = jest.fn().mockResolvedValue([defaultSelfUser])
const setBatchingMock = jest.fn().mockResolvedValue([{ success: true }])
jest.mock('../../../utils/peachAPI', () => ({
  getSelfUser: (...args: unknown[]) => getSelfUserMock(...args),
  setBatching: (...args: unknown[]) => setBatchingMock(...args),
}))

jest.useFakeTimers()

const wrapper = NavigationAndQueryClientWrapper
describe('useTransactionBatchingSetup', () => {
  beforeEach(() => {
    queryClient.clear()
  })
  it('returns defaults', () => {
    const { result } = renderHook(useTransactionBatchingSetup, { wrapper })

    expect(result.current).toEqual({
      isLoading: true,
      isBatchingEnabled: false,
      toggleBatching: expect.any(Function),
    })
    jest.runAllTimers()
  })
  it('sets up header correctly', () => {
    renderHook(useTransactionBatchingSetup, { wrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('calls self user', async () => {
    const { result } = renderHook(useTransactionBatchingSetup, { wrapper })

    await waitFor(() =>
      expect(result.current).toEqual({
        isLoading: false,
        isBatchingEnabled: false,
        toggleBatching: expect.any(Function),
      }),
    )
  })
  it('enables batching when disabled', async () => {
    const { result } = renderHook(useTransactionBatchingSetup, { wrapper })

    result.current.toggleBatching()
    await waitFor(() => expect(setBatchingMock).toHaveBeenCalledWith({ enableBatching: true }))
  })
  it('disables batching when enabled', async () => {
    getSelfUserMock.mockResolvedValue([{ ...defaultSelfUser, isBatchingEnabled: true }])

    const { result } = renderHook(useTransactionBatchingSetup, { wrapper })
    await waitFor(() => expect(result.current.isBatchingEnabled).toBeTruthy())
    result.current.toggleBatching()
    await waitFor(() => expect(setBatchingMock).toHaveBeenCalledWith({ enableBatching: false }))
  })
  it('shows confirmation popup before disabling batching', async () => {
    useTradeSummaryStore.getState().setContracts([{ ...contractSummary, tradeStatus: 'payoutPending' }])
    getSelfUserMock.mockResolvedValue([{ ...defaultSelfUser, isBatchingEnabled: true }])
    const { result } = renderHook(useTransactionBatchingSetup, { wrapper })
    await waitFor(() =>
      expect(result.current).toEqual({
        isLoading: false,
        isBatchingEnabled: true,
        toggleBatching: expect.any(Function),
      }),
    )
    result.current.toggleBatching()

    expect(usePopupStore.getState()).toStrictEqual({
      ...usePopupStore.getState(),
      title: 'turn off batching',
      content: <TurnOffBatching />,
      visible: true,
      level: 'APP',
      action2: {
        callback: expect.any(Function),
        icon: 'xCircle',
        label: 'no, wait',
      },
      action1: {
        callback: expect.any(Function),
        icon: 'arrowRightCircle',
        label: 'yes, pay out',
      },
    })
    await waitFor(() => expect(setBatchingMock).not.toHaveBeenCalled())

    usePopupStore.getState().action1?.callback()
    await waitFor(() => expect(setBatchingMock).toHaveBeenCalledWith({ enableBatching: false }))
    act(() => useTradeSummaryStore.getState().reset())
  })
})
