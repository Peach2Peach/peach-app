import { API_URL } from '@env'
import { useMemo } from 'react'
import { Image, View } from 'react-native'
import { NewHeader, Screen, Text } from '../../components'
import { useRoute, useShowHelp } from '../../hooks'
import { useMeetupEventsStore } from '../../store/meetupEventsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { PeachScrollView } from '../PeachScrollView'
import { PrimaryButton } from '../buttons'
import { CurrencySelection } from '../inputs/paymentMethods/paymentForms/components'
import { Link } from './components/Link'
import { useDeletePaymentMethod } from './hooks/useDeletePaymentMethod'
import { useMeetupScreenSetup } from './hooks/useMeetupScreenSetup'

export const MeetupScreen = () => {
  const { paymentMethod, event, deletable, addToPaymentMethods, selectedCurrencies, onCurrencyToggle }
    = useMeetupScreenSetup()

  return (
    <Screen>
      <MeetupScreenHeader />
      <PeachScrollView contentContainerStyle={tw`justify-center grow`}>
        {!!event.logo && (
          <Image source={{ uri: API_URL + event.logo }} style={tw`w-full mb-5 h-30`} resizeMode={'contain'} />
        )}
        <View style={tw`gap-8`}>
          <Text style={tw`body-l text-black-1`}>{i18n('meetup.description', event.longName)}</Text>
          {!!event.frequency && (
            <View style={tw`gap-4`}>
              <Text style={tw`body-l`}>
                {`${i18n('meetup.date')}: `}
                <Text style={tw`h6`}>{event.frequency}</Text>
              </Text>
              {!!event.address && <Text style={tw`body-l text-black-1`}>{event.address}</Text>}
            </View>
          )}
          <View style={tw`gap-4`}>
            {!!event.address && (
              <Link text={i18n('view.maps')} url={`http://maps.google.com/maps?daddr=${event.address}`} />
            )}
            {!!event.url && <Link text={i18n('meetup.website')} url={event.url} />}
          </View>
          {event.currencies.length > 1 && (
            <CurrencySelection onToggle={onCurrencyToggle} {...{ paymentMethod, selectedCurrencies }} />
          )}
        </View>
      </PeachScrollView>
      {(!deletable || event.currencies.length > 1) && (
        <PrimaryButton style={tw`self-center`} onPress={addToPaymentMethods}>
          {i18n('meetup.add')}
        </PrimaryButton>
      )}
    </Screen>
  )
}

function MeetupScreenHeader () {
  const route = useRoute<'meetupScreen'>()
  const { eventId } = route.params
  const deletable = route.params.deletable ?? false
  const showHelp = useShowHelp('cashTrades')
  const deletePaymentMethod = useDeletePaymentMethod(`cash.${eventId}`)
  const getMeetupEvent = useMeetupEventsStore((state) => state.getMeetupEvent)

  const icons = useMemo(() => {
    const icns = [{ ...headerIcons.help, onPress: showHelp }]
    if (deletable) {
      icns[1] = { ...headerIcons.delete, onPress: deletePaymentMethod }
    }
    return icns
  }, [deletable, deletePaymentMethod, showHelp])

  return <NewHeader title={getMeetupEvent(eventId)?.shortName} icons={icons} />
}
