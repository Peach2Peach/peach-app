import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Text } from '../'
import { DrawerContext } from '../../contexts/drawer'
import { CountrySelect } from '../../drawers/CountrySelect'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { FlagType } from '../flags'
import { sessionStorage } from '../../utils/session'
import MeetupSummary from './MeetupSummary'
import { sortAlphabetically } from '../../utils/array/sortAlphabetically'

type AddPaymentMethodProps = ComponentProps & {
  origin: keyof RootStackParamList
  isCash: boolean
}

export default ({ origin, isCash, style }: AddPaymentMethodProps): ReactElement => {
  const navigation = useNavigation()
  const [, updateDrawer] = useContext(DrawerContext)

  const addPaymentMethods = () => {
    navigation.push('addPaymentMethod', { origin })
  }

  const eventsByCountry: Record<string, MeetupEvent[]> = {}

  const addCashPaymentMethods = async () => {
    const allEvents: MeetupEvent[] = sessionStorage.getMap('meetupEvents') ?? []
    if (!!allEvents) {
      allEvents.map((event) => {
        if (event.country in eventsByCountry) {
          eventsByCountry[event.country] = [...eventsByCountry[event.country], event]
        } else {
          eventsByCountry[event.country] = [event]
        }
        return eventsByCountry
      })
    }

    const goToEventDetails = (event: MeetupEvent) => {
      updateDrawer({
        show: false,
      })
      navigation.push('meetupScreen', { eventId: event.id.replace('cash.', ''), origin })
    }

    const selectCountry = (selected: FlagType) => {
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
          content: <CountrySelect countries={Object.keys(eventsByCountry) as FlagType[]} onSelect={selectCountry} />,
          show: true,
        },
        show: true,
      })
    }

    updateDrawer({
      title: i18n('country.select'),
      content: <CountrySelect countries={Object.keys(eventsByCountry) as FlagType[]} onSelect={selectCountry} />,
      show: true,
    })
  }

  return (
    <View style={style}>
      <View style={tw`flex items-center`}>
        <Pressable
          testID="buy-add-mop"
          onPress={isCash ? addCashPaymentMethods : addPaymentMethods}
          style={tw`flex flex-row items-center`}
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
