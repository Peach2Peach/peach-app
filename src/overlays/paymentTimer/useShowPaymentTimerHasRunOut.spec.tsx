import { act, renderHook } from '@testing-library/react-native'
import { account1 } from '../../../tests/unit/data/accountData'
import { contract } from '../../../tests/unit/data/contractData'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { NavigationWrapper, navigateMock, replaceMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { MessageContext, defaultMessageState } from '../../contexts/message'
import { usePopupStore } from '../../store/usePopupStore'
import { setAccount } from '../../utils/account'
import { getSellOfferIdFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { PeachWallet } from '../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../utils/wallet/setWallet'
import { PaymentTimerHasRunOut } from './PaymentTimerHasRunOut'
import { useShowPaymentTimerHasRunOut } from './useShowPaymentTimerHasRunOut'
import { defaultOverlay } from '../../contexts/overlay'

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
jest.mock('../../utils/wallet/PeachWallet')

describe('useShowPaymentTimerHasRunOut', () => {
  afterEach(() => {
    usePopupStore.setState(defaultOverlay)
    jest.clearAllMocks()
  })

  it('should show the payment timer has run out usePopupStore.getState()if inTrade is false', () => {
    const { result } = renderHook(useShowPaymentTimerHasRunOut, { wrapper: NavigationWrapper })
    act(() => {
      result.current(contract, false)
    })
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
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
  it('should show the payment timer has run out usePopupStore.getState()if inTrade is true', () => {
    const { result } = renderHook(useShowPaymentTimerHasRunOut, { wrapper: NavigationWrapper })
    act(() => {
      result.current(contract, true)
    })
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
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
  it('should close the usePopupStore.getState()when the close action is called', () => {
    const { result } = renderHook(useShowPaymentTimerHasRunOut, { wrapper: NavigationWrapper })
    act(() => {
      result.current(contract, false)
    })
    act(() => {
      usePopupStore.getState().action2?.callback()
    })
    expect(usePopupStore.getState().visible).toBe(false)
  })
  it('should go to the contract screen when the check trade action is called', () => {
    const { result } = renderHook(useShowPaymentTimerHasRunOut, { wrapper: NavigationWrapper })
    act(() => {
      result.current(contract, false)
    })
    act(() => {
      usePopupStore.getState().action1?.callback()
    })
    expect(usePopupStore.getState().visible).toBe(false)
    expect(navigateMock).toHaveBeenCalledWith('contract', {
      contractId: contract.id,
    })
  })
  it('should cancel the trade when the cancel trade action is called', async () => {
    setAccount({ ...account1, offers: [{ ...sellOffer, id: getSellOfferIdFromContract(contract) }] })
    // @ts-ignore
    setPeachWallet(new PeachWallet())
    const { result } = renderHook(useShowPaymentTimerHasRunOut, { wrapper: NavigationWrapper })
    act(() => {
      result.current(contract, true)
    })
    await act(() => {
      usePopupStore.getState().action2?.callback()
    })

    expect(mockCancelContract).toHaveBeenCalledWith({ contractId: contract.id })

    expect(usePopupStore.getState().visible).toBe(false)
    expect(replaceMock).toHaveBeenCalledWith('contract', { contractId: contract.id })
  })
  it('should grant the buyer extra time when the extra time action is called', async () => {
    const { result } = renderHook(useShowPaymentTimerHasRunOut, {
      wrapper: ({ children }) => (
        <NavigationWrapper>
          <MessageWrapper>{children}</MessageWrapper>
        </NavigationWrapper>
      ),
    })
    act(() => {
      result.current(contract, true)
    })
    await act(() => {
      usePopupStore.getState().action1?.callback()
    })

    expect(mockExtendPaymentTimer).toHaveBeenCalledWith({ contractId: contract.id })

    expect(usePopupStore.getState().visible).toBe(false)
  })
  it('should show a message if the buyer extra time fails', async () => {
    mockExtendPaymentTimer.mockImplementationOnce((_args: unknown) => Promise.resolve([false, { error: 'testError' }]))
    const { result } = renderHook(useShowPaymentTimerHasRunOut, {
      wrapper: ({ children }) => (
        <NavigationWrapper>
          <MessageWrapper>{children}</MessageWrapper>
        </NavigationWrapper>
      ),
    })
    act(() => {
      result.current(contract, true)
    })
    await act(() => {
      usePopupStore.getState().action1?.callback()
    })

    expect(mockExtendPaymentTimer).toHaveBeenCalledWith({ contractId: contract.id })

    expect(usePopupStore.getState().visible).toBe(false)
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
