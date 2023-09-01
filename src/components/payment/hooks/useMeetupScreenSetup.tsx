import { useMemo, useState } from 'react'
import { useHeaderSetup, useRoute } from '../../../hooks'
import { useGoToOrigin } from '../../../hooks/useGoToOrigin'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useMeetupEventsStore } from '../../../store/meetupEventsStore'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { account } from '../../../utils/account'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { getPaymentMethodInfo } from '../../../utils/paymentMethod'
import { toggleCurrency } from '../../inputs/paymentMethods/paymentForms/utils'
import { useDeletePaymentMethod } from './useDeletePaymentMethod'

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

  const showHelp = useShowHelp('cashTrades')
  const deletePaymentMethod = useDeletePaymentMethod(`cash.${event.id}`)
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

  const icons = useMemo(() => {
    const icns = [{ ...headerIcons.help, onPress: showHelp }]
    if (deletable) {
      icns[1] = { ...headerIcons.delete, onPress: deletePaymentMethod }
    }
    return icns
  }, [deletable, deletePaymentMethod, showHelp])

  useHeaderSetup({
    title: event.shortName,
    icons,
  })

  return {
    paymentMethod: `cash.${event.id}` as PaymentMethod,
    event,
    deletable,
    addToPaymentMethods,
    selectedCurrencies,
    onCurrencyToggle,
  }
}
