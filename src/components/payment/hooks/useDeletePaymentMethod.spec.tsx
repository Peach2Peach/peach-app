import { fireEvent, render, renderHook, waitFor } from 'test-utils'
import { validSEPAData } from '../../../../tests/unit/data/paymentData'
import { goBackMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { defaultPopupState, usePopupStore } from '../../../store/usePopupStore'
import { Popup } from '../../popup'
import { useDeletePaymentMethod } from './useDeletePaymentMethod'

describe('useDeletePaymentMethod', () => {
  beforeEach(() => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData)
    usePopupStore.setState(defaultPopupState)
  })
  it('should show the popup', () => {
    const { result } = renderHook(() => useDeletePaymentMethod(validSEPAData.id))
    result.current()
    expect(usePopupStore.getState().visible).toBe(true)
  })

  it('should close the popup when action1 is clicked', () => {
    const { result } = renderHook(() => useDeletePaymentMethod(validSEPAData.id))
    result.current()
    const { getByText } = render(<Popup />)
    fireEvent.press(getByText('never mind'))
    expect(usePopupStore.getState().visible).toBe(false)
  })

  it('should remove the payment data, close the popup and go back when action2 is clicked', async () => {
    const { result } = renderHook(() => useDeletePaymentMethod(validSEPAData.id))
    expect(usePaymentDataStore.getState().getPaymentData(validSEPAData.id)).not.toBeUndefined()
    result.current()
    const { getByText } = render(<Popup />)
    fireEvent.press(getByText('delete'))
    expect(usePopupStore.getState().visible).toBe(false)
    expect(goBackMock).toHaveBeenCalled()
    await waitFor(() => expect(usePaymentDataStore.getState().getPaymentData(validSEPAData.id)).toBeUndefined())
  })
})
