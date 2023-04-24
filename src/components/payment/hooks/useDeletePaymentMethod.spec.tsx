import { useDeletePaymentMethod } from './useDeletePaymentMethod'
import { renderHook } from '@testing-library/react-native'
import { defaultOverlay, OverlayContext } from '../../../contexts/overlay'
import { NavigationContext } from '@react-navigation/native'
import { DeletePaymentMethodConfirm } from '../../../overlays/info/DeletePaymentMethodConfirm'
import i18n from '../../../utils/i18n'
import { account, setAccount } from '../../../utils/account'

let overlay = defaultOverlay
const updateOverlay = jest.fn((newOverlay) => {
  overlay = newOverlay
})
const goBackMock = jest.fn()
const wrapper = ({ children }: { children: JSX.Element }) => (
  // @ts-ignore
  <NavigationContext.Provider value={{ goBack: goBackMock }}>
    <OverlayContext.Provider value={[overlay, updateOverlay]}>{children}</OverlayContext.Provider>
  </NavigationContext.Provider>
)

describe('useDeletePaymentMethod', () => {
  beforeEach(() => {
    setAccount({ ...account, paymentData: [{ id: 'sepa', label: 'sepa', currencies: ['EUR'], type: 'sepa' }] })
  })
  it('should show the overlay', () => {
    const { result } = renderHook(() => useDeletePaymentMethod('sepa'), { wrapper })
    result.current()
    expect(overlay).toStrictEqual({
      title: i18n('help.paymentMethodDelete.title'),
      content: <DeletePaymentMethodConfirm />,
      visible: true,
      level: 'ERROR',
      action1: {
        callback: expect.any(Function),
        icon: 'xSquare',
        label: i18n('neverMind'),
      },
      action2: {
        callback: expect.any(Function),
        icon: 'trash',
        label: i18n('delete'),
      },
    })
  })

  it('should close the overlay when action1 is clicked', () => {
    const { result } = renderHook(() => useDeletePaymentMethod('sepa'), { wrapper })
    result.current()
    overlay?.action1?.callback()
    expect(overlay.visible).toBe(false)
  })

  it('should remove the payment data, close the overlay and go back when action2 is clicked', () => {
    const { result } = renderHook(() => useDeletePaymentMethod('sepa'), { wrapper })
    result.current()
    overlay?.action2?.callback()
    expect(account.paymentData).toStrictEqual([])
    expect(overlay.visible).toBe(false)
    expect(goBackMock).toHaveBeenCalled()
  })
})
