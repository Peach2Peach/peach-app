import React, { useMemo } from 'react'
import { useHeaderSetup, useRoute } from '../../../hooks'
import { useGoToOrigin } from '../../../hooks/useGoToOrigin'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useMeetupEventsStore } from '../../../store/meetupEventsStore'
import { addPaymentData } from '../../../utils/account'
import { getPaymentMethodInfo } from '../../../utils/paymentMethod'
import { openAppLink } from '../../../utils/web'
import { HelpIcon } from '../../icons'
import { DeleteIcon } from '../../icons/DeleteIcon'
import { useDeletePaymentMethod } from './useDeletePaymentMethod'

export const useMeetupScreenSetup = () => {
  const route = useRoute<'meetupScreen'>()
  const { eventId } = route.params
  const deletable = route.params.deletable ?? false
  const goToOrigin = useGoToOrigin()
  const getMeetupEvent = useMeetupEventsStore((state) => state.getMeetupEvent)
  const event = getMeetupEvent(eventId) || {
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
