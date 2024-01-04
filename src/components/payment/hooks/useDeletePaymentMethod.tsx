import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../../hooks/useNavigation'
import { ErrorPopup } from '../../../popups/ErrorPopup'
import { DeletePaymentMethodConfirm } from '../../../popups/info/DeletePaymentMethodConfirm'
import { usePopupStore } from '../../../store/usePopupStore'
import { removePaymentData } from '../../../utils/account/removePaymentData'
import i18n from '../../../utils/i18n'
import { PopupAction } from '../../popup'

export const useDeletePaymentMethod = (id: string) => {
  const navigation = useNavigation()
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)

  const deleteMethod = useCallback(() => {
    setPopup(
      <ErrorPopup
        title={i18n('help.paymentMethodDelete.title')}
        content={<DeletePaymentMethodConfirm />}
        actions={
          <>
            <PopupAction
              label={i18n('delete')}
              iconId="trash"
              onPress={() => {
                removePaymentData(id)
                navigation.goBack()
                closePopup()
              }}
            />
            <PopupAction label={i18n('neverMind')} iconId="xSquare" onPress={closePopup} reverseOrder />
          </>
        }
      />,
    )
  }, [closePopup, id, navigation, setPopup])

  return deleteMethod
}
