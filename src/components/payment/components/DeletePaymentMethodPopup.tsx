import { useNavigation } from '../../../hooks/useNavigation'
import { ErrorPopup } from '../../../popups/ErrorPopup'
import { DeletePaymentMethodConfirm } from '../../../popups/info/DeletePaymentMethodConfirm'
import { removePaymentData } from '../../../utils/account/removePaymentData'
import i18n from '../../../utils/i18n'
import { useClosePopup } from '../../popup/Popup'
import { PopupAction } from '../../popup/PopupAction'

export function DeletePaymentMethodPopup ({ id }: { id: string }) {
  const navigation = useNavigation()
  const closePopup = useClosePopup()

  return (
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
    />
  )
}
