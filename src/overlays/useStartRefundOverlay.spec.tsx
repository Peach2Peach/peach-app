import { useStartRefundOverlay } from './useStartRefundOverlay'
import { act, renderHook } from '@testing-library/react-native'
import { navigateMock, NavigationWrapper } from '../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../tests/unit/helpers/QueryClientWrapper'
import { defaultOverlay, OverlayContext } from '../contexts/overlay'
import { sellOffer } from '../../tests/unit/data/offerData'
import { Loading } from '../components'
import { Refund } from './Refund'
import { settingsStore, useSettingsStore } from '../store/settingsStore'
import { refundSellOffer } from '../utils/peachAPI'
import { saveOffer } from '../utils/offer'
import { useTradeSummaries } from '../hooks/query/useTradeSummaries'
import { peachWallet } from '../utils/wallet/setWallet'
import { getEscrowWalletForOffer } from '../utils/wallet'
import { useShowErrorBanner } from '../hooks/useShowErrorBanner'
import { showTransaction } from '../utils/bitcoin'

let overlay = defaultOverlay
const updateOverlay = jest.fn((newOverlay) => {
  overlay = newOverlay
})
const OverlayWrapper = ({ children }: { children: JSX.Element }) => (
  <OverlayContext.Provider value={[overlay, updateOverlay]}>{children}</OverlayContext.Provider>
)

const cancelOfferMock = jest.fn((..._args: any) => Promise.resolve([null, null]))
const refundSellOfferMock = jest.fn()
jest.mock('../utils/peachAPI', () => ({
  cancelOffer: (...args: any) => cancelOfferMock(...args),
  refundSellOffer: (...args: any) => refundSellOfferMock(...args),
}))

const checkRefundPSBTMock = jest.fn()
const signAndFinalizePSBTMock = jest.fn()
const showTransactionMock = jest.fn()
jest.mock('../utils/bitcoin', () => ({
  checkRefundPSBT: (...args: any) => checkRefundPSBTMock(...args),
  signAndFinalizePSBT: (...args: any) => signAndFinalizePSBTMock(...args),
  showTransaction: (...args: any) => showTransactionMock(...args),
}))

const saveOfferMock = jest.fn()
jest.mock('../utils/offer', () => ({
  saveOffer: (...args: any) => saveOfferMock(...args),
}))

const syncWalletMock = jest.fn()
jest.mock('../utils/wallet/setWallet', () => ({
  peachWallet: {
    syncWallet: (...args: any) => syncWalletMock(...args),
  },
}))

const refetchTradeSummariesMock = jest.fn()
jest.mock('../hooks/query/useTradeSummaries', () => ({
  useTradeSummaries: jest.fn(() => ({
    refetch: refetchTradeSummariesMock,
  })),
}))

const getEscrowWalletForOfferMock = jest.fn()
jest.mock('../utils/wallet/getEscrowWalletForOffer', () => ({
  getEscrowWalletForOffer: (...args: any) => getEscrowWalletForOfferMock(...args),
}))

const showErrorMock = jest.fn()
jest.mock('../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: jest.fn(() => showErrorMock),
}))

describe('useStartRefundOverlay', () => {
  const wrapper = ({ children }: { children: JSX.Element }) => (
    <QueryClientWrapper>
      <OverlayWrapper>
        <NavigationWrapper>{children}</NavigationWrapper>
      </OverlayWrapper>
    </QueryClientWrapper>
  )

  afterEach(() => {
    overlay = defaultOverlay
    jest.clearAllMocks()
  })
  it('should return a function', () => {
    const { result } = renderHook(useStartRefundOverlay, { wrapper })
    expect(result.current).toBeInstanceOf(Function)
  })

  it('should show the loading overlay when called', () => {
    const { result } = renderHook(useStartRefundOverlay, { wrapper })
    result.current(sellOffer)
    expect(overlay).toStrictEqual({
      title: 'refunding escrow',
      content: (
        <Loading
          color="#2B1911"
          style={{
            alignSelf: 'center',
          }}
        />
      ),
      visible: true,
      level: 'APP',
      requireUserAction: true,
      action1: {
        label: 'loading...',
        icon: 'clock',
        callback: expect.any(Function),
      },
    })
  })

  it('should refund the escrow when there is a cancel result', async () => {
    cancelOfferMock.mockResolvedValueOnce([{ psbt: 'psbt' }, null])
    checkRefundPSBTMock.mockReturnValueOnce({ psbt: 'checkedPsbt', err: null })
    signAndFinalizePSBTMock.mockReturnValueOnce({
      extractTransaction: () => ({ toHex: () => 'hex', getId: () => 'id' }),
    })
    refundSellOfferMock.mockResolvedValueOnce([null, null])
    getEscrowWalletForOfferMock.mockReturnValueOnce('escrowWallet')
    settingsStore.setState({ peachWalletActive: false })
    const { result } = renderHook(useStartRefundOverlay, { wrapper })
    await result.current(sellOffer)
    expect(checkRefundPSBTMock).toHaveBeenCalledWith('psbt', sellOffer)
    expect(signAndFinalizePSBTMock).toHaveBeenCalledWith('checkedPsbt', 'escrowWallet')
    expect(overlay).toStrictEqual({
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
    expect(syncWalletMock).toHaveBeenCalled()
  })

  it('should handle cancelation errors', async () => {
    cancelOfferMock.mockResolvedValueOnce([null, { error: 'error' }])
    const { result } = renderHook(useStartRefundOverlay, { wrapper })
    await result.current(sellOffer)
    expect(showErrorMock).toHaveBeenCalledWith('error')
    expect(overlay).toStrictEqual({ visible: false })
  })

  it('should handle psbt errors', async () => {
    cancelOfferMock.mockResolvedValueOnce([{ psbt: 'psbt' }, null])
    checkRefundPSBTMock.mockReturnValueOnce({ psbt: 'something went wrong', err: 'error' })
    const { result } = renderHook(useStartRefundOverlay, { wrapper })
    await result.current(sellOffer)
    expect(showErrorMock).toHaveBeenCalledWith('error')
    expect(overlay).toStrictEqual({ visible: false })
  })

  it('should handle refund errors', async () => {
    cancelOfferMock.mockResolvedValueOnce([{ psbt: 'psbt' }, null])
    checkRefundPSBTMock.mockReturnValueOnce({ psbt: 'checkedPsbt', err: null })
    signAndFinalizePSBTMock.mockReturnValueOnce({
      extractTransaction: () => ({ toHex: () => 'hex', getId: () => 'id' }),
    })
    refundSellOfferMock.mockResolvedValueOnce([null, { error: 'error' }])
    getEscrowWalletForOfferMock.mockReturnValueOnce('escrowWallet')
    settingsStore.setState({ peachWalletActive: false })
    const { result } = renderHook(useStartRefundOverlay, { wrapper })
    await result.current(sellOffer)
    expect(showErrorMock).toHaveBeenCalledWith('error')
    expect(overlay).toStrictEqual({ visible: false })
  })

  it('should close overlay and go to trades on close of success overlay', async () => {
    cancelOfferMock.mockResolvedValueOnce([{ psbt: 'psbt' }, null])
    checkRefundPSBTMock.mockReturnValueOnce({ psbt: 'checkedPsbt', err: null })
    signAndFinalizePSBTMock.mockReturnValueOnce({
      extractTransaction: () => ({ toHex: () => 'hex', getId: () => 'id' }),
    })
    refundSellOfferMock.mockResolvedValueOnce([null, null])
    getEscrowWalletForOfferMock.mockReturnValueOnce('escrowWallet')
    settingsStore.setState({ peachWalletActive: false })
    const { result } = renderHook(useStartRefundOverlay, { wrapper })
    await result.current(sellOffer)
    act(() => {
      overlay.action1?.callback()
    })
    expect(overlay).toStrictEqual({ visible: false })
    expect(navigateMock).toHaveBeenCalledWith('yourTrades', { tab: 'history' })
  })

  it('should show the right success overlay when peach wallet is active', async () => {
    cancelOfferMock.mockResolvedValueOnce([{ psbt: 'psbt' }, null])
    checkRefundPSBTMock.mockReturnValueOnce({ psbt: 'checkedPsbt', err: null })
    signAndFinalizePSBTMock.mockReturnValueOnce({
      extractTransaction: () => ({ toHex: () => 'hex', getId: () => 'id' }),
    })
    refundSellOfferMock.mockResolvedValueOnce([null, null])
    getEscrowWalletForOfferMock.mockReturnValueOnce('escrowWallet')
    settingsStore.setState({ peachWalletActive: true })
    const { result } = renderHook(useStartRefundOverlay, { wrapper })
    await result.current(sellOffer)
    expect(overlay).toStrictEqual({
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
    cancelOfferMock.mockResolvedValueOnce([{ psbt: 'psbt' }, null])
    checkRefundPSBTMock.mockReturnValueOnce({ psbt: 'checkedPsbt', err: null })
    signAndFinalizePSBTMock.mockReturnValueOnce({
      extractTransaction: () => ({ toHex: () => 'hex', getId: () => 'id' }),
    })
    refundSellOfferMock.mockResolvedValueOnce([null, null])
    getEscrowWalletForOfferMock.mockReturnValueOnce('escrowWallet')
    settingsStore.setState({ peachWalletActive: true })
    const { result } = renderHook(useStartRefundOverlay, { wrapper })
    await result.current(sellOffer)
    act(() => {
      overlay.action2?.callback()
    })
    expect(overlay).toStrictEqual({ visible: false })
    expect(navigateMock).toHaveBeenCalledWith('transactionDetails', { txId: 'id' })
  })

  it('should call showTransaction if peach wallet is not active', async () => {
    cancelOfferMock.mockResolvedValueOnce([{ psbt: 'psbt' }, null])
    checkRefundPSBTMock.mockReturnValueOnce({ psbt: 'checkedPsbt', err: null })
    signAndFinalizePSBTMock.mockReturnValueOnce({
      extractTransaction: () => ({ toHex: () => 'hex', getId: () => 'id' }),
    })
    refundSellOfferMock.mockResolvedValueOnce([null, null])
    getEscrowWalletForOfferMock.mockReturnValueOnce('escrowWallet')
    settingsStore.setState({ peachWalletActive: false })
    const { result } = renderHook(useStartRefundOverlay, { wrapper })
    await result.current(sellOffer)
    act(() => {
      overlay.action2?.callback()
    })
    expect(overlay).toStrictEqual({ visible: false })
    expect(showTransactionMock).toHaveBeenCalledWith('id', 'regtest')
  })
})
