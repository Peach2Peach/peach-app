import { act, renderHook } from 'test-utils'
import { sellOffer } from '../../tests/unit/data/offerData'
import { navigateMock } from '../../tests/unit/helpers/NavigationWrapper'
import { Refund } from '../popups/Refund'
import { useSettingsStore } from '../store/settingsStore'
import { defaultPopupState, usePopupStore } from '../store/usePopupStore'
import { useRefundEscrow } from './useRefundEscrow'

const getRefundPSBTMock = jest.fn().mockResolvedValue([null, null])
const refundSellOfferMock = jest.fn()
jest.mock('../utils/peachAPI', () => ({
  getRefundPSBT: (...args: unknown[]) => getRefundPSBTMock(...args),
  refundSellOffer: (...args: unknown[]) => refundSellOfferMock(...args),
}))

const checkRefundPSBTMock = jest.fn()
const signAndFinalizePSBTMock = jest.fn()
const showTransactionMock = jest.fn()
jest.mock('../utils/bitcoin', () => ({
  checkRefundPSBT: (...args: unknown[]) => checkRefundPSBTMock(...args),
  signAndFinalizePSBT: (...args: unknown[]) => signAndFinalizePSBTMock(...args),
  showTransaction: (...args: unknown[]) => showTransactionMock(...args),
}))

const saveOfferMock = jest.fn()
jest.mock('../utils/offer', () => ({
  saveOffer: (...args: unknown[]) => saveOfferMock(...args),
}))

const refetchTradeSummariesMock = jest.fn()
jest.mock('../hooks/query/useTradeSummaries', () => ({
  useTradeSummaries: jest.fn(() => ({
    refetch: refetchTradeSummariesMock,
  })),
}))

const getEscrowWalletForOfferMock = jest.fn()
jest.mock('../utils/wallet/getEscrowWalletForOffer', () => ({
  getEscrowWalletForOffer: (...args: unknown[]) => getEscrowWalletForOfferMock(...args),
}))

const showErrorMock = jest.fn()
jest.mock('../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorMock,
}))

describe('useRefundEscrow', () => {
  const psbt = 'psbt'

  const mockSuccess = () => {
    getRefundPSBTMock.mockResolvedValueOnce([{ psbt: 'psbt' }, null])
    checkRefundPSBTMock.mockReturnValueOnce({ psbt: 'checkedPsbt', err: null })
    signAndFinalizePSBTMock.mockReturnValueOnce({
      extractTransaction: () => ({ toHex: () => 'hex', getId: () => 'id' }),
    })
    refundSellOfferMock.mockResolvedValueOnce([null, null])
    getEscrowWalletForOfferMock.mockReturnValueOnce('escrowWallet')
  }
  beforeEach(() => {
    usePopupStore.setState(defaultPopupState)
    useSettingsStore.getState().setShowBackupReminder(false)
  })
  it('should return a function', () => {
    const { result } = renderHook(useRefundEscrow)
    expect(result.current).toBeInstanceOf(Function)
  })

  it('should refund the escrow when there is a cancel result', async () => {
    mockSuccess()
    useSettingsStore.setState({ peachWalletActive: false })
    const { result } = renderHook(useRefundEscrow)
    await act(async () => {
      await result.current(sellOffer, psbt)
    })
    expect(checkRefundPSBTMock).toHaveBeenCalledWith('psbt', sellOffer)
    expect(signAndFinalizePSBTMock).toHaveBeenCalledWith('checkedPsbt', 'escrowWallet')
    expect(usePopupStore.getState()).toStrictEqual({
      ...usePopupStore.getState(),
      title: 'escrow refunded',
      content: <Refund isPeachWallet={false} />,
      visible: true,
      level: 'APP',
      requireUserAction: true,
      action1: {
        label: 'close',
        icon: 'xSquare',
        callback: expect.any(Function),
      },
      action2: {
        label: 'show tx',
        icon: 'externalLink',
        callback: expect.any(Function),
      },
    })
    expect(saveOfferMock).toHaveBeenCalledWith({
      ...sellOffer,
      tx: 'hex',
      txId: 'id',
      refunded: true,
    })
    expect(refetchTradeSummariesMock).toHaveBeenCalled()
  })

  it('should handle psbt errors', async () => {
    getRefundPSBTMock.mockResolvedValueOnce([{ psbt: 'psbt' }, null])
    checkRefundPSBTMock.mockReturnValueOnce({ psbt: 'something went wrong', err: 'error' })
    const { result } = renderHook(useRefundEscrow)
    await act(async () => {
      await result.current(sellOffer, psbt)
    })
    expect(showErrorMock).toHaveBeenCalledWith('error')
    expect(usePopupStore.getState().visible).toEqual(false)
  })

  it('should handle refund errors', async () => {
    getRefundPSBTMock.mockResolvedValueOnce([{ psbt: 'psbt' }, null])
    checkRefundPSBTMock.mockReturnValueOnce({ psbt: 'checkedPsbt', err: null })
    signAndFinalizePSBTMock.mockReturnValueOnce({
      extractTransaction: () => ({ toHex: () => 'hex', getId: () => 'id' }),
    })
    refundSellOfferMock.mockResolvedValueOnce([null, { error: 'error' }])
    getEscrowWalletForOfferMock.mockReturnValueOnce('escrowWallet')
    useSettingsStore.setState({ peachWalletActive: false })
    const { result } = renderHook(useRefundEscrow)
    await act(async () => {
      await result.current(sellOffer, psbt)
    })
    expect(showErrorMock).toHaveBeenCalledWith('error')
    expect(usePopupStore.getState().visible).toEqual(false)
  })

  it('should close popup and go to trades on close of success popup', async () => {
    mockSuccess()
    useSettingsStore.setState({ peachWalletActive: false })
    const { result } = renderHook(useRefundEscrow)
    await act(async () => {
      await result.current(sellOffer, psbt)
    })
    act(() => {
      usePopupStore.getState().action1?.callback()
    })
    expect(usePopupStore.getState().visible).toEqual(false)
    expect(navigateMock).toHaveBeenCalledWith('yourTrades', { tab: 'history' })
  })
  it('should close popup and go to backup time on close of success popup if backup is needed', async () => {
    mockSuccess()
    useSettingsStore.getState().setPeachWalletActive(true)
    useSettingsStore.getState().setShowBackupReminder(true)

    const { result } = renderHook(useRefundEscrow)
    await act(async () => {
      await result.current(sellOffer, psbt)
    })
    act(() => {
      usePopupStore.getState().action1?.callback()
    })
    expect(usePopupStore.getState().visible).toEqual(false)
    expect(navigateMock).toHaveBeenCalledWith('backupTime', { nextScreen: 'yourTrades' })
  })

  it('should show the right success popup when peach wallet is active', async () => {
    mockSuccess()
    useSettingsStore.setState({ peachWalletActive: true })
    const { result } = renderHook(useRefundEscrow)
    await act(async () => {
      await result.current(sellOffer, psbt)
    })
    expect(usePopupStore.getState()).toStrictEqual({
      ...usePopupStore.getState(),
      title: 'escrow refunded',
      content: <Refund isPeachWallet={true} />,
      visible: true,
      level: 'APP',
      requireUserAction: true,
      action1: {
        label: 'close',
        icon: 'xSquare',
        callback: expect.any(Function),
      },
      action2: {
        label: 'go to wallet',
        icon: 'wallet',
        callback: expect.any(Function),
      },
    })
  })

  it('should go to peach wallet if peach wallet is active', async () => {
    mockSuccess()
    useSettingsStore.setState({ peachWalletActive: true })
    const { result } = renderHook(useRefundEscrow)
    await act(async () => {
      await result.current(sellOffer, psbt)
    })
    act(() => {
      usePopupStore.getState().action2?.callback()
    })
    expect(usePopupStore.getState().visible).toEqual(false)
    expect(navigateMock).toHaveBeenCalledWith('transactionDetails', { txId: 'id' })
  })
  it('should go to backup time if backup is needed when going to wallet', async () => {
    mockSuccess()
    useSettingsStore.getState().setPeachWalletActive(true)
    useSettingsStore.getState().setShowBackupReminder(true)

    const { result } = renderHook(useRefundEscrow)
    await act(async () => {
      await result.current(sellOffer, psbt)
    })
    act(() => {
      usePopupStore.getState().action2?.callback()
    })
    expect(navigateMock).toHaveBeenCalledWith('backupTime', { nextScreen: 'transactionDetails', txId: 'id' })
  })

  it('should call showTransaction if peach wallet is not active', async () => {
    mockSuccess()
    useSettingsStore.setState({ peachWalletActive: false })
    const { result } = renderHook(useRefundEscrow)
    await act(async () => {
      await result.current(sellOffer, psbt)
    })
    act(() => {
      usePopupStore.getState().action2?.callback()
    })
    expect(usePopupStore.getState().visible).toEqual(false)
    expect(showTransactionMock).toHaveBeenCalledWith('id', 'regtest')
  })
})
