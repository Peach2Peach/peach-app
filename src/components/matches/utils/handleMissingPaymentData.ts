import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import i18n from '../../../utils/i18n'
import { error } from '../../../utils/log/error'
import { StackNavigation } from '../../../utils/navigation/handlePushNotification'
import { isBuyOffer } from '../../../utils/offer/isBuyOffer'

export const handleMissingPaymentData = (
  offer: BuyOffer | SellOffer,
  currency: Currency,
  paymentMethod: PaymentMethod,
  updateMessage: (value: MessageState) => void,
  navigation: StackNavigation,
  // eslint-disable-next-line max-params
) => {
  error('Payment data could not be found for offer', offer.id)
  const openAddPaymentMethodDialog = () => {
    updateMessage({ msgKey: undefined, level: 'ERROR' })
    const existingPaymentMethodsOfType = usePaymentDataStore.getState().getAllPaymentDataByType(paymentMethod).length + 1
    const label = `${i18n(`paymentMethod.${paymentMethod}`)} #${existingPaymentMethodsOfType}`

    navigation.push('paymentMethodForm', {
      paymentData: {
        type: paymentMethod,
        label,
        currencies: [currency],
        country: /giftCard/u.test(paymentMethod) ? (paymentMethod.split('.').pop() as PaymentMethodCountry) : undefined,
      },
      origin: isBuyOffer(offer) ? 'matchDetails' : 'search',
    })
  }

  updateMessage({
    msgKey: 'PAYMENT_DATA_MISSING',
    level: 'ERROR',
    action: {
      callback: openAddPaymentMethodDialog,
      label: i18n('PAYMENT_DATA_MISSING.action'),
      icon: 'edit3',
    },
    keepAlive: true,
  })
}
