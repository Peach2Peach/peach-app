import React, { ReactElement, useContext, useState } from 'react'
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

type AddPaymentMethodProps = ComponentProps & {
  origin: [keyof RootStackParamList, RootStackParamList[keyof RootStackParamList]]
  isCash: boolean
}

export default ({ origin, isCash, style }: AddPaymentMethodProps): ReactElement => {
  const navigation = useNavigation()
  const [, updateDrawer] = useContext(DrawerContext)

  const [country, setCountry] = useState<FlagType>()

  const addPaymentMethods = () => {
    navigation.push('addPaymentMethod', { origin })
  }

  const addCashPaymentMethods = async () => {
    const eventsByCountry: Record<string, MeetupEvent[]> = sessionStorage.getMap('meetupEvents') ?? {}

    const goToEventDetails = (event: MeetupEvent) => {
      updateDrawer({
        show: false,
      })
      navigation.push('meetupScreen', { event })
    }

    const selectCountry = (country: FlagType) => {
      setCountry(country)
      updateDrawer({
        title: i18n('meetup.select'),
        content: (
          <View>
            {eventsByCountry[country].map((event) => (
              <MeetupSummary event={event} onPress={() => goToEventDetails(event)} />
            ))}
          </View>
        ),
        previousDrawer: countryDrawer,
        show: true,
      })
    }

    const countryDrawer = {
      title: i18n('country.select'),
      content: <CountrySelect countries={Object.keys(eventsByCountry) as FlagType[]} onSelect={selectCountry} />,
      show: true,
    }

    updateDrawer(countryDrawer)
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
