import { useState } from 'react'
import { useRoute } from '../../../hooks'
import { useGoToOrigin } from '../../../hooks/useGoToOrigin'
import { useMeetupEventsStore } from '../../../store/meetupEventsStore'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { account } from '../../../utils/account'
import { getPaymentMethodInfo } from '../../../utils/paymentMethod'
import { toggleCurrency } from '../../inputs/paymentMethods/paymentForms/utils'

export const useMeetupScreenSetup = () => {
  const route = useRoute<'meetupScreen'>()
  const { eventId } = route.params
  const deletable = route.params.deletable ?? false
  const goToOrigin = useGoToOrigin()
  const getMeetupEvent = useMeetupEventsStore((state) => state.getMeetupEvent)
  const event: MeetupEvent = getMeetupEvent(eventId) || {
    id: eventId,
    longName: '',
    shortName: '',
    currencies: [],
    country: 'DE',
    city: '',
    featured: false,
    superFeatured: false,
  }

  const [selectedCurrencies, setSelectedCurrencies] = useState(event.currencies)
  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const addPaymentData = usePaymentDataStore((state) => state.addPaymentData)

  const selectPaymentMethod = useOfferPreferences((state) => state.selectPaymentMethod)

  const addToPaymentMethods = () => {
    const meetupInfo = getPaymentMethodInfo(`cash.${event.id}`)
    if (!meetupInfo) return
    const meetup: PaymentData = {
      id: meetupInfo.id,
      label: event.shortName,
      type: meetupInfo.id,
      userId: account.publicKey,
      currencies: selectedCurrencies,
      country: event.country,
    }
    addPaymentData(meetup)
    selectPaymentMethod(meetupInfo.id)
    goToOrigin(route.params.origin)
  }

  return {
    paymentMethod: `cash.${event.id}` as PaymentMethod,
    event,
    deletable,
    addToPaymentMethods,
    selectedCurrencies,
    onCurrencyToggle,
  }
}
