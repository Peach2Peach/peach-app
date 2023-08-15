import { useContext } from 'react'
import { DrawerContext } from '../../../contexts/drawer'
import { useNavigation, useRoute } from '../../../hooks'
import { useMeetupEvents } from '../../../hooks/query/useMeetupEvents'
import { sortAlphabetically } from '../../../utils/array'
import { Country } from '../../../utils/country/countryMap'
import i18n from '../../../utils/i18n'
import { getCountrySelectDrawerOptions } from '../helpers/getCountrySelectDrawerOptions'
import { mapEventToDrawerOption } from '../helpers/mapEventToDrawerOption'

export const useAddPaymentMethodButtonSetup = () => {
  const navigation = useNavigation()
  const currentRoute = useRoute().name
  const [, updateDrawer] = useContext(DrawerContext)
  const { meetupEvents, isLoading } = useMeetupEvents()
  const addPaymentMethods = () => {
    navigation.navigate('selectCurrency', { origin: currentRoute })
  }

  const goToEventDetails = (eventID: MeetupEvent['id']) => {
    updateDrawer({ show: false })
    navigation.push('meetupScreen', { eventId: eventID.replace('cash.', ''), origin: currentRoute })
  }

  const selectCountry = (eventsByCountry: CountryEventsMap, selected: Country) => {
    if (!meetupEvents) return

    updateDrawer({
      title: i18n('meetup.select'),
      options: eventsByCountry[selected]
        .sort((a, b) => sortAlphabetically(a.city, b.city))
        .sort((a, b) => Number(a.featured) - Number(b.featured))
        .map(mapEventToDrawerOption(goToEventDetails)),
      previousDrawer: getCountrySelectDrawerOptions(meetupEvents, goToEventDetails, selectCountry),
      show: true,
    })
  }

  const addCashPaymentMethods = () => {
    if (!meetupEvents) return
    updateDrawer(getCountrySelectDrawerOptions(meetupEvents, goToEventDetails, selectCountry))
  }

  return { addCashPaymentMethods, addPaymentMethods, isLoading }
}
