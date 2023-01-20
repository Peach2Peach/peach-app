import { API_URL } from '@env'
import React, { ReactElement, useContext, useMemo } from 'react'
import { View, Image, Text, Pressable, Linking } from 'react-native'
import { OverlayContext } from '../../contexts/overlay'
import { useHeaderSetup, useNavigation, useRoute } from '../../hooks'
import { useShowHelp } from '../../hooks/useShowHelp'
import DeletePaymentMethodConfirm from '../../overlays/info/DeletePaymentMethodConfirm'
import tw from '../../styles/tailwind'
import { addPaymentData, removePaymentData } from '../../utils/account'
import i18n from '../../utils/i18n'
import { error, info } from '../../utils/log'
import { getPaymentMethodInfo } from '../../utils/paymentMethod'
import { PrimaryButton } from '../buttons'
import Icon from '../Icon'
import { HelpIcon } from '../icons'
import { DeleteIcon } from '../icons/DeleteIcon'

/**
 * @description Screen for meetup event details.
 * Shows info for the specified event and takes care of adding to paymentMethods
 */

export default (): ReactElement => {
  const route = useRoute<'meetupScreen'>()
  const event = route.params.event
  const deletable = route.params.deletable ?? false
  const navigation = useNavigation()

  const showHelp = useShowHelp('cashTrades')

  const openEventWebsite = () => {
    Linking.canOpenURL(event.url).then((supported) => {
      if (supported) {
        Linking.openURL(event.url)
      } else {
        error('Can\'t open website')
      }
    })
  }

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

  const [, updateOverlay] = useContext(OverlayContext)

  const deletePaymentMethod = () => {
    updateOverlay({
      title: i18n('help.paymentMethodDelete.title'),
      content: <DeletePaymentMethodConfirm />,
      visible: true,
      level: 'ERROR',
      action1: {
        callback: () => updateOverlay({ visible: false }),
        icon: 'xSquare',
        label: i18n('neverMind'),
      },
      action2: {
        callback: () => {
          removePaymentData('cash.' + event.id)
          updateOverlay({ visible: false })
          navigation.goBack()
        },
        icon: 'info',
        label: i18n('delete'),
      },
    })
  }

  const icons = [{ iconComponent: <HelpIcon />, onPress: showHelp }]
  if (deletable) {
    icons[1] = {
      iconComponent: <DeleteIcon />,
      onPress: deletePaymentMethod,
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

  info(API_URL + event.logo)
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
        <Pressable style={tw`flex-row items-center mt-8`} onPress={openEventWebsite}>
          <Text style={tw`underline button-large text-black-2`}>{i18n('meetup.website')}</Text>
          <Icon id={'externalLink'} style={tw`w-5 h-5 ml-1`} color={tw`text-primary-main`.color} />
        </Pressable>
      </View>
      {!deletable && (
        <PrimaryButton style={tw`absolute self-center bottom-8`} onPress={addToPaymentMethods}>
          {i18n('meetup.add')}
        </PrimaryButton>
      )}
    </>
  )
}
