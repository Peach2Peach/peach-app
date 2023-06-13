import { useContext } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Text } from '../'
import { DrawerContext } from '../../contexts/drawer'
import { CountrySelect } from '../../drawers/CountrySelect'
import { useNavigation } from '../../hooks'
import { useMeetupEvents } from '../../hooks/query/useMeetupEvents'
import tw from '../../styles/tailwind'
import { structureEventsByCountry } from '../../utils/events'
import i18n from '../../utils/i18n'
import { FlagType } from '../flags'
import MeetupSummary from './MeetupSummary'
import { sortAlphabetically } from '../../utils/array/sortAlphabetically'
import { Country } from '../../utils/country/countryMap'

type AddPaymentMethodProps = ComponentProps & {
  origin: keyof RootStackParamList
  isCash: boolean
}

export default ({ origin, isCash, style }: AddPaymentMethodProps) => {
  const navigation = useNavigation()
  const [, updateDrawer] = useContext(DrawerContext)
  const { meetupEvents, isLoading } = useMeetupEvents()
  const addPaymentMethods = () => {
    navigation.push('addPaymentMethod', { origin })
  }

  const goToEventDetails = (event: MeetupEvent) => {
    updateDrawer({
      show: false,
    })
    navigation.push('meetupScreen', { eventId: event.id.replace('cash.', ''), origin })
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

  const addCashPaymentMethods = () => {
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
