import React, { useMemo } from 'react'
import { useHeaderSetup, useRoute } from '../../../hooks'
import { useGoToOrigin } from '../../../hooks/useGoToOrigin'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { addPaymentData } from '../../../utils/account'
import { getPaymentMethodInfo } from '../../../utils/paymentMethod'
import { sessionStorage } from '../../../utils/session'
import { openAppLink } from '../../../utils/web'
import { HelpIcon } from '../../icons'
import { DeleteIcon } from '../../icons/DeleteIcon'
import { useDeletePaymentMethod } from './useDeletePaymentMethod'

export const useMeetupScreenSetup = () => {
  const route = useRoute<'meetupScreen'>()
  const { eventId } = route.params
  const deletable = route.params.deletable ?? false
  const goToOrigin = useGoToOrigin()
  const allEvents: MeetupEvent[] = sessionStorage.getMap('meetupEvents') ?? []
  const event: MeetupEvent = allEvents.find((item) => item.id === eventId) ?? {
    id: eventId,
    longName: '',
    shortName: '',
    country: 'ES',
    city: '',
  }

  const openLink = (url: string) => (url ? openAppLink(url) : null)

  const showHelp = useShowHelp('cashTrades')
  const deletePaymentMethod = useDeletePaymentMethod('cash.' + event.id)

  const addToPaymentMethods = () => {
    const meetupInfo = getPaymentMethodInfo('cash.' + event.id)
    const meetup: PaymentData = {
      id: 'cash.' + meetupInfo.id,
      label: event.shortName,
      type: meetupInfo.id,
      currencies: meetupInfo.currencies,
      country: event.country,
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
        title: event.longName,
        icons,
      }),
      [event.longName, icons],
    ),
  )

  return { event, openLink, deletable, addToPaymentMethods }
}
