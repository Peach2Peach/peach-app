import { renderHook, waitFor } from '@testing-library/react-native'
import { goBackMock, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { DeletePaymentMethodConfirm } from '../../../overlays/info/DeletePaymentMethodConfirm'
import { usePopupStore } from '../../../store/usePopupStore'
import { account, setAccount } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { useDeletePaymentMethod } from './useDeletePaymentMethod'
import { apiSuccess } from '../../../../tests/unit/data/peachAPIData'

const wrapper = ({ children }: { children: JSX.Element }) => <NavigationWrapper>{children}</NavigationWrapper>

const deletePaymentHashMock = jest.fn().mockResolvedValue([apiSuccess])
jest.mock('../../../utils/peachAPI', () => ({
  deletePaymentHash: () => deletePaymentHashMock(),
}))

describe('useDeletePaymentMethod', () => {
  beforeEach(() => {
    setAccount({ ...account, paymentData: [{ id: 'sepa', label: 'sepa', currencies: ['EUR'], type: 'sepa' }] })
  })
  it('should show the overlay', () => {
    const { result } = renderHook(() => useDeletePaymentMethod('sepa'), { wrapper })
    result.current()
    expect(usePopupStore.getState()).toStrictEqual({
      ...usePopupStore.getState(),
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
    usePopupStore.getState().action1?.callback()
    expect(usePopupStore.getState().visible).toBe(false)
  })

  it('should remove the payment data, close the overlay and go back when action2 is clicked', async () => {
    const { result } = renderHook(() => useDeletePaymentMethod('sepa'), { wrapper })
    result.current()
    usePopupStore.getState().action2?.callback()
    expect(usePopupStore.getState().visible).toBe(false)
    expect(goBackMock).toHaveBeenCalled()
    await waitFor(() => expect(account.paymentData).toStrictEqual([]))
  })
})
