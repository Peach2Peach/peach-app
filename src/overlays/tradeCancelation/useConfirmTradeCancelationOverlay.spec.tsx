import { renderHook } from '@testing-library/react-native'
import { contract } from '../../../tests/unit/data/contractData'
import { ConfirmCancelTradeRequest } from './ConfirmCancelTradeRequest'
import { useConfirmTradeCancelationOverlay } from './useConfirmTradeCancelationOverlay'
import { apiSuccess, unauthorizedError } from '../../../tests/unit/data/peachAPIData'
import { defaultPopupState, usePopupStore } from '../../store/usePopupStore'
import { NavigationWrapper, replaceMock } from '../../../tests/unit/helpers/NavigationWrapper'

const showErrorBannerMock = jest.fn()
const useShowErrorBannerMock = jest.fn().mockReturnValue(showErrorBannerMock)
jest.mock('../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => useShowErrorBannerMock(),
}))
const showLoadingPopupMock = jest.fn()
const useShowLoadingPopupMock = jest.fn().mockReturnValue(showLoadingPopupMock)
jest.mock('../../hooks/useShowLoadingPopup', () => ({
  useShowLoadingPopup: () => useShowLoadingPopupMock(),
}))

const confirmContractCancelationMock = jest.fn().mockResolvedValue([apiSuccess, null])
const rejectContractCancelationMock = jest.fn().mockResolvedValue([apiSuccess, null])
jest.mock('../../utils/peachAPI', () => ({
  confirmContractCancelation: (...args: any[]) => confirmContractCancelationMock(...args),
  rejectContractCancelation: (...args: any[]) => rejectContractCancelationMock(...args),
}))

const saveContractMock = jest.fn()
jest.mock('../../utils/contract', () => ({
  saveContract: (...args: any[]) => saveContractMock(...args),
}))

describe('useConfirmTradeCancelationOverlay', () => {
  const wrapper = NavigationWrapper

  afterEach(() => {
    jest.clearAllMocks()
    usePopupStore.setState(defaultPopupState)
  })
  it('returns default values correctly', () => {
    const { result } = renderHook(useConfirmTradeCancelationOverlay, { wrapper })

    expect(result.current.showConfirmTradeCancelation).toBeInstanceOf(Function)
    expect(result.current.cancelTrade).toBeInstanceOf(Function)
    expect(result.current.continueTrade).toBeInstanceOf(Function)
  })
  it('opens ConfirmCancelTradeRequest popup', () => {
    const { result } = renderHook(useConfirmTradeCancelationOverlay, { wrapper })
    const disputeOverlayActions = result.current.showConfirmTradeCancelation(contract)

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action2: {
        label: 'cancel',
        icon: 'xCircle',
        callback: disputeOverlayActions.cancelTradeCallback,
      },
      action1: {
        label: 'continue trade',
        icon: 'arrowRightCircle',
        callback: disputeOverlayActions.continueTradeCallback,
      },
      title: 'trade cancelation',
      content: <ConfirmCancelTradeRequest contract={contract} />,
      visible: true,
      level: 'DEFAULT',
    })
  })
  it('ConfirmCancelTradeRequest popup actions call respective functions', () => {
    const { result } = renderHook(useConfirmTradeCancelationOverlay, { wrapper })
    const disputeOverlayActions = result.current.showConfirmTradeCancelation(contract)

    disputeOverlayActions.cancelTradeCallback()
    expect(confirmContractCancelationMock).toHaveBeenCalledWith({ contractId: contract.id })
    disputeOverlayActions.continueTradeCallback()
    expect(rejectContractCancelationMock).toHaveBeenCalledWith({ contractId: contract.id })
  })
  it('cancels trade', async () => {
    const expectedContractUpdate = {
      ...contract,
      canceled: true,
      cancelationRequested: false,
    }
    const { result } = renderHook(useConfirmTradeCancelationOverlay, { wrapper })

    await result.current.cancelTrade(contract)

    expect(showLoadingPopupMock).toHaveBeenCalledWith({
      title: 'trade cancelation',
      level: 'DEFAULT',
    })

    expect(confirmContractCancelationMock).toHaveBeenCalledWith({ contractId: contract.id })
    expect(saveContractMock).toHaveBeenCalledWith(expectedContractUpdate)

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'trade canceled!',
      visible: true,
      level: 'DEFAULT',
    })
    expect(replaceMock).toHaveBeenCalledWith('contract', { contractId: contract.id, contract: expectedContractUpdate })
  })
  it('handles cancel trade errors', async () => {
    confirmContractCancelationMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useConfirmTradeCancelationOverlay, { wrapper })

    await result.current.cancelTrade(contract)

    expect(saveContractMock).not.toHaveBeenCalled()

    expect(usePopupStore.getState().visible).toEqual(false)
    expect(replaceMock).not.toHaveBeenCalled()
    expect(showErrorBannerMock).toHaveBeenCalledWith(unauthorizedError.error)
  })
  it('continues trade', async () => {
    const expectedContractUpdate = {
      ...contract,
      cancelationRequested: false,
    }
    const { result } = renderHook(useConfirmTradeCancelationOverlay, { wrapper })

    await result.current.continueTrade(contract)

    expect(showLoadingPopupMock).toHaveBeenCalledWith({
      title: 'trade cancelation',
      level: 'DEFAULT',
    })

    expect(rejectContractCancelationMock).toHaveBeenCalledWith({ contractId: contract.id })
    expect(saveContractMock).toHaveBeenCalledWith(expectedContractUpdate)
    expect(usePopupStore.getState().visible).toEqual(false)
    expect(replaceMock).toHaveBeenCalledWith('contract', {
      contractId: contract.id,
      contract: expectedContractUpdate,
    })
  })
  it('handles continue trade errors', async () => {
    rejectContractCancelationMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useConfirmTradeCancelationOverlay, { wrapper })

    await result.current.continueTrade(contract)

    expect(saveContractMock).not.toHaveBeenCalled()

    expect(usePopupStore.getState().visible).toEqual(false)
    expect(replaceMock).not.toHaveBeenCalled()
    expect(showErrorBannerMock).toHaveBeenCalledWith(unauthorizedError.error)
  })
})
