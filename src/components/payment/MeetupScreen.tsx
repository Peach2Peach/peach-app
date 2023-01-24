import { API_URL } from '@env'
import React, { ReactElement, useMemo } from 'react'
import { View, Image, Text, Pressable } from 'react-native'
import { useHeaderSetup, useNavigation, useRoute } from '../../hooks'
import { useShowHelp } from '../../hooks/useShowHelp'
import tw from '../../styles/tailwind'
import { addPaymentData } from '../../utils/account'
import i18n from '../../utils/i18n'
import { info } from '../../utils/log'
import { getPaymentMethodInfo } from '../../utils/paymentMethod'
import { PrimaryButton } from '../buttons'
import Icon from '../Icon'
import { HelpIcon } from '../icons'
import { DeleteIcon } from '../icons/DeleteIcon'
import { sessionStorage } from '../../utils/session'
import { openAppLink } from '../../utils/web'
import { useDeletePaymentMethod } from './hooks/useDeletePaymentMethod'

/**
 * @description Screen for meetup event details.
 * Shows info for the specified event and takes care of adding to paymentMethods
 */

export default (): ReactElement => {
  const route = useRoute<'meetupScreen'>()
  const eventId = route.params.eventId
  const deletable = route.params.deletable ?? false
  const navigation = useNavigation()
  const allEvents: MeetupEvent[] = sessionStorage.getMap('meetupEvents') ?? []
  const event = allEvents.find((item) => item.id === eventId) ?? {
    id: eventId,
    name: '',
    logo: '',
    address: '',
    url: '',
  }
  const openLink = (url: string) => (url ? openAppLink(url) : null)

  const showHelp = useShowHelp('cashTrades')
  const deletePaymentMethod = useDeletePaymentMethod('cash.' + event.id)

  const addToPaymentMethods = () => {
    const meetupInfo = getPaymentMethodInfo('cash.' + event.id)
    const meetup: PaymentData = {
      id: meetupInfo.id,
      label: event.name,
      type: meetupInfo.id,
      currencies: meetupInfo.currencies,
      country: meetupInfo.countries ? meetupInfo.countries[0] : undefined,
    }
    addPaymentData(meetup)
    navigation.goBack()
  }

  const icons = [{ iconComponent: <HelpIcon />, onPress: showHelp }]
  if (deletable) {
    icons[1] = {
      iconComponent: <DeleteIcon />,
      onPress: () => deletePaymentMethod(),
    }
  }

  useHeaderSetup(
    useMemo(
      () => ({
        title: event.name,
        icons,
      }),
      [],
    ),
  )

  return (
    <>
      <View style={tw`p-8`}>
        {event.logo !== undefined && (
          <Image source={{ uri: API_URL + event.logo }} style={tw`w-full h-40 mb-5`} resizeMode={'contain'} />
        )}
        <Text style={tw`body-l text-black-1`}>{i18n('meetup.description', event.name)}</Text>
        {event.address !== '' && (
          <>
            <Text style={tw`mt-8 body-l text-black-1`}>{i18n('meetup.address')}</Text>
            <Text style={tw`body-l text-black-1`}>{event.address}</Text>
          </>
        )}
        <View style={tw`mt-8`}>
          {!!event.address && (
            <Pressable
              style={tw`flex-row items-center`}
              onPress={() => openLink('http://maps.google.com/maps?daddr=' + event.address)}
            >
              <Text style={tw`underline button-large text-black-2`}>{i18n('view.maps')}</Text>
              <Icon id={'externalLink'} style={tw`w-5 h-5 ml-1`} color={tw`text-primary-main`.color} />
            </Pressable>
          )}
          <Pressable style={tw`flex-row items-center mt-4`} onPress={() => openLink(event.url)}>
            <Text style={tw`underline button-large text-black-2`}>{i18n('meetup.website')}</Text>
            <Icon id={'externalLink'} style={tw`w-5 h-5 ml-1`} color={tw`text-primary-main`.color} />
          </Pressable>
        </View>
      </View>
      {!deletable && (
        <PrimaryButton style={tw`absolute self-center bottom-8`} onPress={addToPaymentMethods}>
          {i18n('meetup.add')}
        </PrimaryButton>
      )}
    </>
  )
}
