import { API_URL } from '@env'
import { Image, Pressable, View } from 'react-native'
import { Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import Icon from '../Icon'
import { PeachScrollView } from '../PeachScrollView'
import { PrimaryButton } from '../buttons'
import { CurrencySelection } from '../inputs/paymentMethods/paymentForms/components'
import { useMeetupScreenSetup } from './hooks/useMeetupScreenSetup'
import { openAppLink } from '../../utils/web'

type Props = { text: string; url: string }
const Link = ({ text, url }: Props) => (
  <Pressable style={tw`flex-row items-center gap-1`} onPress={() => openAppLink(url)}>
    <Text style={tw`underline button-large text-black-2`}>{text}</Text>
    <Icon id={'externalLink'} style={tw`w-5 h-5`} color={tw`text-primary-main`.color} />
  </Pressable>
)

export const MeetupScreen = () => {
  const { paymentMethod, event, openLink, deletable, addToPaymentMethods, selectedCurrencies, onCurrencyToggle }
    = useMeetupScreenSetup()

  return (
    <>
      <PeachScrollView contentContainerStyle={tw`p-8 pb-20`}>
        {!!event.logo && (
          <Image source={{ uri: API_URL + event.logo }} style={tw`w-full mb-5 h-30`} resizeMode={'contain'} />
        )}
        <View style={tw`gap-8`}>
          <Text style={tw`body-l text-black-1`}>{i18n('meetup.description', event.longName)}</Text>
          {!!event.frequency && (
            <View style={tw`gap-4`}>
              <Text style={tw`body-l`}>
                {i18n('meetup.date') + ': '}
                <Text style={tw`h6`}>{event.frequency}</Text>
              </Text>
              {!!event.address && <Text style={tw`body-l text-black-1`}>{event.address}</Text>}
            </View>
          )}
          <View style={tw`gap-4`}>
            {!!event.address && (
              <Link text={i18n('view.maps')} url={'http://maps.google.com/maps?daddr=' + event.address} />
            )}
            {!!event.url && <Link text={i18n('meetup.website')} url={event.url} />}
          </View>
          {event.currencies.length > 1 && (
            <CurrencySelection
              {...{
                paymentMethod,
                selectedCurrencies,
                onToggle: onCurrencyToggle,
              }}
            />
          )}
        </View>
      </PeachScrollView>
      {!deletable
        || (event.currencies.length > 1 && (
          <PrimaryButton style={tw`absolute self-center bottom-8`} onPress={addToPaymentMethods}>
            {i18n('meetup.add')}
          </PrimaryButton>
        ))}
    </>
  )
}
