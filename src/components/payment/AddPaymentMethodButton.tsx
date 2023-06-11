import { useContext } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Text } from '../'
import { DrawerContext } from '../../contexts/drawer'
import { CountrySelect } from '../../drawers/CountrySelect'
import { useNavigation, useRoute } from '../../hooks'
import { useMeetupEvents } from '../../hooks/query/useMeetupEvents'
import tw from '../../styles/tailwind'
import { sortAlphabetically } from '../../utils/array/sortAlphabetically'
import { Country } from '../../utils/country/countryMap'
import { structureEventsByCountry } from '../../utils/events'
import i18n from '../../utils/i18n'
import { FlagType } from '../flags'
import { MeetupSummary } from './MeetupSummary'

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

  const goToEventDetails = (event: MeetupEvent) => {
    updateDrawer({
      show: false,
    })
    navigation.push('meetupScreen', { eventId: event.id.replace('cash.', ''), origin: currentRoute })
  }

  const selectCountry = (eventsByCountry: CountryEventsMap, selected: Country) => {
    updateDrawer({
      title: i18n('meetup.select'),
      content: (
        <View>
          {eventsByCountry[selected]
            .sort((a, b) => sortAlphabetically(a.city, b.city))
            .map((event) => (
              <MeetupSummary key={event.id} event={event} onPress={() => goToEventDetails(event)} />
            ))}
        </View>
      ),
      previousDrawer: {
        title: i18n('country.select'),
        content: (
          <CountrySelect
            countries={Object.keys(eventsByCountry) as FlagType[]}
            onSelect={(country: FlagType) => selectCountry(eventsByCountry, country)}
          />
        ),
        show: true,
      },
      show: true,
    })
  }

  const addCashPaymentMethods = async () => {
    if (!meetupEvents) return

    const eventsByCountry = meetupEvents.reduce(structureEventsByCountry, {} as CountryEventsMap)

    updateDrawer({
      title: i18n('country.select'),
      content: (
        <CountrySelect
          countries={Object.keys(eventsByCountry) as FlagType[]}
          onSelect={(country: FlagType) => selectCountry(eventsByCountry, country)}
        />
      ),
      show: true,
    })
  }

  return (
    <View style={style}>
      <View style={tw`flex items-center`}>
        <Pressable
          testID="buy-add-mop"
          onPress={isCash ? addCashPaymentMethods : addPaymentMethods}
          disabled={isCash && isLoading}
          style={[tw`flex flex-row items-center`, isCash && isLoading && tw`opacity-50`]}
        >
          <Icon id="plusCircle" style={tw`mr-3 w-7 h-7`} color={tw`text-primary-main`.color} />
          <Text style={tw`h6 text-primary-main`}>
            {i18n(`paymentMethod.select.button.${isCash ? 'cash' : 'remote'}`)}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}
