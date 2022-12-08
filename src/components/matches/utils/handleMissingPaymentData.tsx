import i18n from '../../../utils/i18n'

import { getPaymentDataByType } from '../../../utils/account'
import { error } from '../../../utils/log'
import { StackNavigation } from '../../../utils/navigation'

export const handleMissingPaymentData = (
  offer: BuyOffer | SellOffer,
  currency: Currency,
  paymentMethod: PaymentMethod,
  updateMessage: (value: MessageState) => void,
  navigation: StackNavigation,
  routeParams: Readonly<{
    offer: BuyOffer | SellOffer
    hasMatches: boolean | undefined
  }>,
  // eslint-disable-next-line max-params
) => {
  error('Payment data could not be found for offer', offer.id)
  const openAddPaymentMethodDialog = () => {
    updateMessage({ msgKey: undefined, level: 'ERROR' })
    const existingPaymentMethodsOfType = getPaymentDataByType(paymentMethod).length + 1
    const label = i18n(`paymentMethod.${paymentMethod}`) + ' #' + existingPaymentMethodsOfType

    navigation.push('paymentDetails', {
      paymentData: {
        type: paymentMethod,
        label,
        currencies: [currency],
        country: /giftCard/u.test(paymentMethod) ? (paymentMethod.split('.').pop() as Country) : undefined,
      },
      origin: ['search', routeParams],
    })
  }

  updateMessage({
    msgKey: 'PAYMENT_DATA_MISSING',
    level: 'ERROR',
    action: openAddPaymentMethodDialog,
    actionLabel: i18n('PAYMENT_DATA_MISSING.action'),
    keepAlive: true,
  })
}
