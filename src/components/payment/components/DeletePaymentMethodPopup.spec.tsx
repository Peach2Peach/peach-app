import { fireEvent, render, waitFor } from 'test-utils'
import { validSEPAData } from '../../../../tests/unit/data/paymentData'
import { goBackMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { Popup } from '../../popup/Popup'
import { DeletePaymentMethodPopup } from './DeletePaymentMethodPopup'

describe('useDeletePaymentMethod', () => {
  beforeEach(() => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData)
  })

  it('should close the popup when action1 is clicked', () => {
    const { getByText } = render(<DeletePaymentMethodPopup id={validSEPAData.id} />)
    fireEvent.press(getByText('never mind'))
    const { queryByText } = render(<Popup />)

    expect(queryByText('delete payment method?')).toBeFalsy()
  })

  it('should remove the payment data, close the popup and go back when action2 is clicked', async () => {
    expect(usePaymentDataStore.getState().getPaymentData(validSEPAData.id)).not.toBeUndefined()
    const { getByText } = render(<DeletePaymentMethodPopup id={validSEPAData.id} />)
    fireEvent.press(getByText('delete'))
    const { queryByText } = render(<Popup />)
    expect(queryByText('delete payment method?')).toBeFalsy()
    expect(goBackMock).toHaveBeenCalled()
    await waitFor(() => expect(usePaymentDataStore.getState().getPaymentData(validSEPAData.id)).toBeUndefined())
  })
})
