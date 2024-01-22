import { useCallback } from 'react'
import { useNavigation } from '../../../hooks/useNavigation'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import i18n from '../../../utils/i18n'
import { error } from '../../../utils/log/error'
import { isBuyOffer } from '../../../utils/offer/isBuyOffer'
import { useSetToast } from '../../toast/Toast'

export const useHandleMissingPaymentData = () => {
  const navigation = useNavigation()
  const setToast = useSetToast()
  const getAllPaymentDataByType = usePaymentDataStore((state) => state.getAllPaymentDataByType)

  const openAddPaymentMethodDialog = useCallback(
    (offer: BuyOffer | SellOffer, currency: Currency, paymentMethod: PaymentMethod) => {
      const existingPaymentMethodsOfType = getAllPaymentDataByType(paymentMethod).length + 1
      const label = `${i18n(`paymentMethod.${paymentMethod}`)} #${existingPaymentMethodsOfType}`

      navigation.push('paymentMethodForm', {
        paymentData: {
          type: paymentMethod,
          label,
          currencies: [currency],
          country: /giftCard/u.test(paymentMethod)
            ? (paymentMethod.split('.').pop() as PaymentMethodCountry)
            : undefined,
        },
        origin: isBuyOffer(offer) ? 'matchDetails' : 'search',
      })
    },
    [getAllPaymentDataByType, navigation],
  )

  const handleMissingPaymentData = useCallback(
    (offer: BuyOffer | SellOffer, currency: Currency, paymentMethod: PaymentMethod) => {
      error('Payment data could not be found for offer', offer.id)

      setToast({
        msgKey: 'PAYMENT_DATA_MISSING',
        color: 'red',
        action: {
          onPress: () => openAddPaymentMethodDialog(offer, currency, paymentMethod),
          label: i18n('PAYMENT_DATA_MISSING.action'),
          iconId: 'edit3',
        },
        keepAlive: true,
      })
    },
    [openAddPaymentMethodDialog, setToast],
  )

  return handleMissingPaymentData
}
