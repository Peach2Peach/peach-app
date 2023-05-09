import { renderHook } from '@testing-library/react-native'
import { goBackMock, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { defaultOverlay, OverlayContext } from '../../../contexts/overlay'
import { DeletePaymentMethodConfirm } from '../../../overlays/info/DeletePaymentMethodConfirm'
import { account, setAccount } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { useDeletePaymentMethod } from './useDeletePaymentMethod'

let overlay = defaultOverlay
const updateOverlay = jest.fn((newOverlay) => {
  overlay = newOverlay
})
const wrapper = ({ children }: { children: JSX.Element }) => (
  <NavigationWrapper>
    <OverlayContext.Provider value={[overlay, updateOverlay]}>{children}</OverlayContext.Provider>
  </NavigationWrapper>
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
