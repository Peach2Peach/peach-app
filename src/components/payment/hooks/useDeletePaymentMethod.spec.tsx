import { renderHook, waitFor } from 'test-utils'
import { validSEPAData } from '../../../../tests/unit/data/paymentData'
import { apiSuccess } from '../../../../tests/unit/data/peachAPIData'
import { goBackMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { DeletePaymentMethodConfirm } from '../../../popups/info/DeletePaymentMethodConfirm'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { useDeletePaymentMethod } from './useDeletePaymentMethod'

const deletePaymentHashMock = jest.fn().mockResolvedValue([apiSuccess])
jest.mock('../../../utils/peachAPI', () => ({
  deletePaymentHash: () => deletePaymentHashMock(),
}))

describe('useDeletePaymentMethod', () => {
  beforeEach(() => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData)
  })
  it('should show the popup', () => {
    const { result } = renderHook(() => useDeletePaymentMethod(validSEPAData.id))
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

  it('should close the popup when action1 is clicked', () => {
    const { result } = renderHook(() => useDeletePaymentMethod(validSEPAData.id))
    result.current()
    usePopupStore.getState().action1?.callback()
    expect(usePopupStore.getState().visible).toBe(false)
  })

  it('should remove the payment data, close the popup and go back when action2 is clicked', async () => {
    const { result } = renderHook(() => useDeletePaymentMethod(validSEPAData.id))
    expect(usePaymentDataStore.getState().getPaymentData(validSEPAData.id)).not.toBeUndefined()
    result.current()
    usePopupStore.getState().action2?.callback()
    expect(usePopupStore.getState().visible).toBe(false)
    expect(goBackMock).toHaveBeenCalled()
    await waitFor(() => expect(usePaymentDataStore.getState().getPaymentData(validSEPAData.id)).toBeUndefined())
  })
})
