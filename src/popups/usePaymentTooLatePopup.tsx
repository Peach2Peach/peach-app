import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../hooks'
import { usePopupStore } from '../store/usePopupStore'
import i18n from '../utils/i18n'
import { PaymentTooLate } from './warning/PaymentTooLate'

export const usePaymentTooLatePopup = () => {
  const navigation = useNavigation()
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const goToHelp = useCallback(() => {
    closePopup()
    navigation.navigate('contact')
  }, [closePopup, navigation])

  const showPaymentTooLatePopup = useCallback(() => {
    setPopup({
      title: i18n('help.tooLate.title'),
      content: <PaymentTooLate />,
      visible: true,
      action2: {
        callback: goToHelp,
        label: i18n('help'),
        icon: 'info',
      },
      level: 'WARN',
    })
  }, [goToHelp, setPopup])

  return showPaymentTooLatePopup
}
