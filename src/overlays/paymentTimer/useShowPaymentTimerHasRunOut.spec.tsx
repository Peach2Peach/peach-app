import { useShowPaymentTimerHasRunOut } from './useShowPaymentTimerHasRunOut'
import { act, renderHook } from '@testing-library/react-native'
import { defaultOverlay, OverlayContext } from '../../contexts/overlay'
import i18n from '../../utils/i18n'
import { PaymentTimerHasRunOut } from './PaymentTimerHasRunOut'
import { contract } from '../../../tests/unit/data/contractData'
import { NavigationContext } from '@react-navigation/native'
import { defaultMessageState, MessageContext } from '../../contexts/message'

let overlay = defaultOverlay
const updateOverlay = jest.fn((newOverlay) => {
  overlay = newOverlay
})
const OverlayWrapper = ({ children }: { children: any }) => (
  <OverlayContext.Provider value={[overlay, updateOverlay]}>{children}</OverlayContext.Provider>
)

const mockNavigate = jest.fn()
const mockReplace = jest.fn()
const NavigationWrapper = ({ children }: { children: any }) => (
  // @ts-ignore
  <NavigationContext.Provider value={{ navigate: mockNavigate, replace: mockReplace }}>
    {children}
  </NavigationContext.Provider>
)

let messageState = defaultMessageState
const setMessage = jest.fn((newMessageState) => {
  messageState = newMessageState
})

const MessageWrapper = ({ children }: { children: any }) => (
  <MessageContext.Provider value={[messageState, setMessage]}>{children}</MessageContext.Provider>
)

const mockCancelContract = jest.fn((_args: unknown) => Promise.resolve([true, null]))
const mockExtendPaymentTimer = jest.fn((_args: unknown): Promise<[unknown, unknown]> => Promise.resolve([true, null]))
jest.mock('../../utils/peachAPI', () => ({
  cancelContract: (args: unknown) => mockCancelContract(args),
  extendPaymentTimer: (args: unknown) => mockExtendPaymentTimer(args),
}))

describe('useShowPaymentTimerHasRunOut', () => {
  it('should show the payment timer has run out overlay if inTrade is false', () => {
    const { result } = renderHook(useShowPaymentTimerHasRunOut, {
      wrapper: ({ children }) => (
        <NavigationWrapper>
          <OverlayWrapper>{children}</OverlayWrapper>
        </NavigationWrapper>
      ),
    })
    act(() => {
      result.current(contract, false)
    })
    expect(overlay).toStrictEqual({
      title: i18n('contract.seller.paymentTimerHasRunOut.title'),
      content: <PaymentTimerHasRunOut contract={contract} />,
      visible: true,
      level: 'WARN',
      action1: {
        label: i18n('checkTrade'),
        icon: 'arrowLeftCircle',
        callback: expect.any(Function),
      },
      action2: {
        label: i18n('close'),
        icon: 'xSquare',
        callback: expect.any(Function),
      },
    })
  })
  it('should show the payment timer has run out overlay if inTrade is true', () => {
    const { result } = renderHook(useShowPaymentTimerHasRunOut, {
      wrapper: ({ children }) => (
        <NavigationWrapper>
          <OverlayWrapper>{children}</OverlayWrapper>
        </NavigationWrapper>
      ),
    })
    act(() => {
      result.current(contract, true)
    })
    expect(overlay).toStrictEqual({
      title: i18n('contract.seller.paymentTimerHasRunOut.title'),
      content: <PaymentTimerHasRunOut contract={contract} />,
      visible: true,
      level: 'WARN',
      action1: {
        label: i18n('contract.seller.paymentTimerHasRunOut.extraTime'),
        icon: 'clock',
        callback: expect.any(Function),
      },
      action2: {
        label: i18n('contract.seller.paymentTimerHasRunOut.cancelTrade'),
        icon: 'xSquare',
        callback: expect.any(Function),
      },
    })
  })
  it('should close the overlay when the close action is called', () => {
    const { result } = renderHook(useShowPaymentTimerHasRunOut, {
      wrapper: ({ children }) => (
        <NavigationWrapper>
          <OverlayWrapper>{children}</OverlayWrapper>
        </NavigationWrapper>
      ),
    })
    act(() => {
      result.current(contract, false)
    })
    act(() => {
      overlay?.action2?.callback()
    })
    expect(overlay.visible).toBe(false)
  })
  it('should go to the contract screen when the check trade action is called', () => {
    const { result } = renderHook(useShowPaymentTimerHasRunOut, {
      wrapper: ({ children }) => (
        <NavigationWrapper>
          <OverlayWrapper>{children}</OverlayWrapper>
        </NavigationWrapper>
      ),
    })
    act(() => {
      result.current(contract, false)
    })
    act(() => {
      overlay?.action1?.callback()
    })
    expect(overlay.visible).toBe(false)
    expect(mockNavigate).toHaveBeenCalledWith('contract', {
      contractId: contract.id,
    })
  })
  it('should cancel the trade when the cancel trade action is called', async () => {
    const { result } = renderHook(useShowPaymentTimerHasRunOut, {
      wrapper: ({ children }) => (
        <NavigationWrapper>
          <OverlayWrapper>{children}</OverlayWrapper>
        </NavigationWrapper>
      ),
    })
    act(() => {
      result.current(contract, true)
    })
    await act(() => {
      overlay?.action2?.callback()
    })

    expect(mockCancelContract).toHaveBeenCalledWith({ contractId: contract.id })

    expect(overlay.visible).toBe(false)
    expect(mockReplace).toHaveBeenCalledWith('contract', { contractId: contract.id })
  })
  it('should grant the buyer extra time when the extra time action is called', async () => {
    const { result } = renderHook(useShowPaymentTimerHasRunOut, {
      wrapper: ({ children }) => (
        <NavigationWrapper>
          <OverlayWrapper>
            <MessageWrapper>{children}</MessageWrapper>
          </OverlayWrapper>
        </NavigationWrapper>
      ),
    })
    act(() => {
      result.current(contract, true)
    })
    await act(() => {
      overlay?.action1?.callback()
    })

    expect(mockExtendPaymentTimer).toHaveBeenCalledWith({ contractId: contract.id })

    expect(overlay.visible).toBe(false)
  })
  it('should show a message if the buyer extra time fails', async () => {
    mockExtendPaymentTimer.mockImplementationOnce((_args: unknown) => Promise.resolve([false, { error: 'testError' }]))
    const { result } = renderHook(useShowPaymentTimerHasRunOut, {
      wrapper: ({ children }) => (
        <NavigationWrapper>
          <OverlayWrapper>
            <MessageWrapper>{children}</MessageWrapper>
          </OverlayWrapper>
        </NavigationWrapper>
      ),
    })
    act(() => {
      result.current(contract, true)
    })
    await act(() => {
      overlay?.action1?.callback()
    })

    expect(mockExtendPaymentTimer).toHaveBeenCalledWith({ contractId: contract.id })

    expect(overlay.visible).toBe(false)
    expect(messageState).toStrictEqual({
      msgKey: 'TESTERROR',
      level: 'ERROR',
      bodyArgs: undefined,
      action: {
        callback: expect.any(Function),
        label: i18n('contactUs'),
        icon: 'mail',
      },
    })
  })
})
