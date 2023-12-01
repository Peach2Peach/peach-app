import { act, renderHook, responseUtils, waitFor } from 'test-utils'
import { contractSummary } from '../../../../tests/unit/data/contractSummaryData'
import { defaultUser } from '../../../../tests/unit/data/userData'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { TurnOffBatching } from '../../../popups/app/TurnOffBatching'
import { useTradeSummaryStore } from '../../../store/tradeSummaryStore'
import { usePopupStore } from '../../../store/usePopupStore'
import { peachAPI } from '../../../utils/peachAPI'
import { useTransactionBatchingSetup } from './useTransactionBatchingSetup'

const setBatchingMock = jest.spyOn(peachAPI.private.user, 'enableTransactionBatching')

const getSelfUserMock = jest.spyOn(peachAPI.private.user, 'getSelfUser')

jest.useFakeTimers()

describe('useTransactionBatchingSetup', () => {
  beforeEach(() => {
    queryClient.clear()
  })
  it('returns defaults', () => {
    const { result } = renderHook(useTransactionBatchingSetup)

    expect(result.current).toEqual({
      isLoading: true,
      isBatchingEnabled: false,
      toggleBatching: expect.any(Function),
    })
    jest.runAllTimers()
  })
  it('calls self user', async () => {
    const { result } = renderHook(useTransactionBatchingSetup)

    await waitFor(() =>
      expect(result.current).toEqual({
        isLoading: false,
        isBatchingEnabled: false,
        toggleBatching: expect.any(Function),
      }),
    )
  })
  it('enables batching when disabled', async () => {
    const { result } = renderHook(useTransactionBatchingSetup)

    result.current.toggleBatching()
    await waitFor(() => expect(setBatchingMock).toHaveBeenCalledWith({ enableBatching: true }))
  })
  it('disables batching when enabled', async () => {
    getSelfUserMock.mockResolvedValue({
      result: { ...defaultUser, isBatchingEnabled: true },
      error: undefined,
      ...responseUtils,
    })

    const { result } = renderHook(useTransactionBatchingSetup)
    await waitFor(() => expect(result.current.isBatchingEnabled).toBeTruthy())
    result.current.toggleBatching()
    await waitFor(() => expect(setBatchingMock).toHaveBeenCalledWith({ enableBatching: false }))
  })
  it('shows confirmation popup before disabling batching', async () => {
    useTradeSummaryStore.getState().setContracts([{ ...contractSummary, tradeStatus: 'payoutPending' }])
    getSelfUserMock.mockResolvedValue({
      result: { ...defaultUser, isBatchingEnabled: true },
      error: undefined,
      ...responseUtils,
    })
    const { result } = renderHook(useTransactionBatchingSetup)
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
        label: 'yes, I want it faster',
      },
    })
    await waitFor(() => expect(setBatchingMock).not.toHaveBeenCalled())

    usePopupStore.getState().action1?.callback()
    await waitFor(() => expect(setBatchingMock).toHaveBeenCalledWith({ enableBatching: false }))
    act(() => useTradeSummaryStore.getState().reset())
  })
})
