import { API_URL } from '@env'
import { Image, Pressable, View } from 'react-native'
import { Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { PrimaryButton } from '../buttons'
import Icon from '../Icon'
import { PeachScrollView } from '../PeachScrollView'
import { useMeetupScreenSetup } from './hooks/useMeetupScreenSetup'

/**
 * @description Screen for meetup event details.
 * Shows info for the specified event and takes care of adding to paymentMethods
 */
export const MeetupScreen = () => {
  const { event, openLink, deletable, addToPaymentMethods } = useMeetupScreenSetup()

  return (
    <View style={tw`h-full pb-7`}>
      <PeachScrollView contentContainerStyle={tw`justify-center flex-grow p-8`}>
        {!!event.logo && (
          <Image source={{ uri: API_URL + event.logo }} style={tw`w-full mb-5 h-30`} resizeMode={'contain'} />
        )}
        <Text style={tw`body-l text-black-1`}>{i18n('meetup.description', event.longName)}</Text>
        {!!event.frequency && (
          <View style={tw`flex-row mt-8`}>
            <Text style={tw`body-l`}>
              {i18n('meetup.date') + ': '}
              <Text style={tw`h6`}>{event.frequency}</Text>
            </Text>
          </View>
        )}
        {!!event.address && <Text style={tw`mt-4 body-l text-black-1`}>{event.address}</Text>}
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
        <PrimaryButton style={tw`self-center`} onPress={addToPaymentMethods}>
          {i18n('meetup.add')}
        </PrimaryButton>
      )}
    </View>
  )
}
