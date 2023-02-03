import { API_URL } from '@env'
import React, { ReactElement } from 'react'
import { Image, Pressable, Text, View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { PrimaryButton } from '../buttons'
import Icon from '../Icon'
import PeachScrollView from '../PeachScrollView'
import { useMeetupScreenSetup } from './hooks/useMeetupScreenSetup'

/**
 * @description Screen for meetup event details.
 * Shows info for the specified event and takes care of adding to paymentMethods
 */
export default (): ReactElement => {
  const { event, openLink, deletable, addToPaymentMethods } = useMeetupScreenSetup()

  return (
    <>
      <PeachScrollView contentContainerStyle={tw`p-8 pb-20`}>
        {event.logo !== undefined && (
          <Image source={{ uri: API_URL + event.logo }} style={tw`w-full h-40 mb-5`} resizeMode={'contain'} />
        )}
        <Text style={tw`body-l text-black-1`}>{i18n('meetup.description', event.name)}</Text>

        <Text style={tw`mt-8 body-l text-black-1`}>{i18n('meetup.address')}</Text>
        <Text style={tw`body-l text-black-1`}>
          {!!event.address ? event.address : i18n('address.changingLocations')}
        </Text>

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
          {!!event.url && (
            <Pressable style={tw`flex-row items-center mt-4`} onPress={() => openLink(event.url ?? '')}>
              <Text style={tw`underline button-large text-black-2`}>{i18n('meetup.website')}</Text>
              <Icon id={'externalLink'} style={tw`w-5 h-5 ml-1`} color={tw`text-primary-main`.color} />
            </Pressable>
          )}
        </View>
      </PeachScrollView>
      {!deletable && (
        <PrimaryButton style={tw`absolute self-center bottom-8`} onPress={addToPaymentMethods}>
          {i18n('meetup.add')}
        </PrimaryButton>
      )}
    </>
  )
}
