import React, { useMemo } from 'react'
import { useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { addPaymentData } from '../../../utils/account'
import { getPaymentMethodInfo } from '../../../utils/paymentMethod'
import { sessionStorage } from '../../../utils/session'
import { openAppLink } from '../../../utils/web'
import { HelpIcon } from '../../icons'
import { DeleteIcon } from '../../icons/DeleteIcon'
import { useDeletePaymentMethod } from './useDeletePaymentMethod'

const previousScreen: Partial<Record<keyof RootStackParamList, keyof RootStackParamList>> = {
  buyPreferences: 'buy',
  sellPreferences: 'sell',
  paymentMethods: 'settings',
}

export const useMeetupScreenSetup = () => {
  const route = useRoute<'meetupScreen'>()
  const { eventId } = route.params
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

  const goToOrigin = (origin: [keyof RootStackParamList, RootStackParamList[keyof RootStackParamList]]) => {
    navigation.reset({
      index: 2,
      routes: [
        { name: 'home' },
        { name: previousScreen[origin[0]] || 'home' },
        {
          name: origin[0],
          params: origin[1],
        },
      ],
    })
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
    goToOrigin(route.params.origin)
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
      [event.name, icons],
    ),
  )

  return { event, openLink, deletable, addToPaymentMethods }
}
