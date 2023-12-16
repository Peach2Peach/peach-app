import { act, fireEvent, render, renderHook, responseUtils, waitFor } from 'test-utils'
import { contractSummary } from '../../../../tests/unit/data/contractSummaryData'
import { defaultUser } from '../../../../tests/unit/data/userData'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { Popup } from '../../../components/popup'
import { PopupAction } from '../../../components/popup/PopupAction'
import { PopupComponent } from '../../../components/popup/PopupComponent'
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

    expect(usePopupStore.getState().visible).toBeTruthy()
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <PopupComponent
        title={'turn off batching'}
        content={<TurnOffBatching />}
        actions={
          <>
            <PopupAction label={'no, wait'} iconId={'xCircle'} onPress={expect.any(Function)} />
            <PopupAction
              label={'yes, I want it faster'}
              iconId={'arrowRightCircle'}
              onPress={expect.any(Function)}
              reverseOrder
            />
          </>
        }
      />,
    )
    await waitFor(() => expect(setBatchingMock).not.toHaveBeenCalled())

    const { getByText } = render(<Popup />)
    fireEvent.press(getByText('yes, I want it faster'))

    await waitFor(() => expect(setBatchingMock).toHaveBeenCalledWith({ enableBatching: false }))
    act(() => useTradeSummaryStore.getState().reset())
  })
})
