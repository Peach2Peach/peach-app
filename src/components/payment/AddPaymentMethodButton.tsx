import { useContext } from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon, Text } from '../'
import { DrawerContext } from '../../contexts/drawer'
import { useNavigation, useRoute } from '../../hooks'
import { useMeetupEvents } from '../../hooks/query/useMeetupEvents'
import tw from '../../styles/tailwind'
import { sortAlphabetically } from '../../utils/array/sortAlphabetically'
import { Country } from '../../utils/country/countryMap'
import { structureEventsByCountry } from '../../utils/events'
import i18n from '../../utils/i18n'
import { keys } from '../../utils/object'

type Props = ComponentProps & {
  isCash: boolean
}

export const AddPaymentMethodButton = ({ isCash, style }: Props) => {
  const navigation = useNavigation()
  const currentRoute = useRoute().name
  const [, updateDrawer] = useContext(DrawerContext)
  const { meetupEvents, isLoading } = useMeetupEvents()
  const addPaymentMethods = () => {
    navigation.push('addPaymentMethod', { origin: currentRoute })
  }

  const goToEventDetails = (eventID: MeetupEvent['id']) => {
    updateDrawer({ show: false })
    navigation.push('meetupScreen', { eventId: eventID.replace('cash.', ''), origin: currentRoute })
  }

  const selectCountry = (eventsByCountry: CountryEventsMap, selected: Country) => {
    updateDrawer({
      title: i18n('meetup.select'),
      options: eventsByCountry[selected]
        .sort((a, b) => sortAlphabetically(a.city, b.city))
        .sort((a) => (a.featured ? -1 : 1))
        .map(({ longName, city, featured, id }) => ({
          title: longName,
          subtext: city,
          highlighted: featured,
          onPress: () => goToEventDetails(id),
        })),
      previousDrawer: {
        title: i18n('country.select'),
        show: true,
        options: keys(eventsByCountry)
          .sort((a, b) => sortAlphabetically(i18n(`country.${a}`), i18n(`country.${b}`)))
          .map((country) => ({
            title: i18n(`country.${country}`),
            flagID: country,
            onPress: () => selectCountry(eventsByCountry, country),
          })),
      },
      show: true,
    })
  }

  const addCashPaymentMethods = () => {
    if (!meetupEvents) return
    const eventsByCountry = meetupEvents.reduce(structureEventsByCountry, {} as CountryEventsMap)

    updateDrawer({
      title: i18n('country.select'),
      options: keys(eventsByCountry)
        .sort((a, b) => sortAlphabetically(i18n(`country.${a}`), i18n(`country.${b}`)))
        .map((country) => ({
          title: i18n(`country.${country}`),
          flagID: country,
          onPress: () => selectCountry(eventsByCountry, country),
        })),
      show: true,
    })
  }

  return (
    <TouchableOpacity
      onPress={isCash ? addCashPaymentMethods : addPaymentMethods}
      disabled={isCash && isLoading}
      style={[tw`flex-row items-center self-center`, style, isCash && isLoading && tw`opacity-50`]}
    >
      <Icon id="plusCircle" style={tw`mr-3 w-7 h-7`} color={tw`text-primary-main`.color} />
      <Text style={tw`h6 text-primary-main`}>{i18n(`paymentMethod.select.button.${isCash ? 'cash' : 'remote'}`)}</Text>
    </TouchableOpacity>
  )
}
