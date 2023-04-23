import { useMemo } from 'react'
import { useHeaderSetup, useRoute } from '../../../hooks'
import { useGoToOrigin } from '../../../hooks/useGoToOrigin'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useMeetupEventsStore } from '../../../store/meetupEventsStore'
import { account, addPaymentData } from '../../../utils/account'
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
    longName: '',
    shortName: '',
    country: 'DE',
    city: '',
  }

  const openLink = (url: string) => (url ? openAppLink(url) : null)

  const showHelp = useShowHelp('cashTrades')
  const deletePaymentMethod = useDeletePaymentMethod('cash.' + event.id)

  const addToPaymentMethods = async () => {
    const meetupInfo = getPaymentMethodInfo('cash.' + event.id)
    const meetup: PaymentData = {
      id: meetupInfo.id,
      label: event.shortName,
      userId: account.publicKey,
      type: meetupInfo.id,
      currencies: meetupInfo.currencies,
      country: event.country,
    }
    addPaymentData(meetup)
    goToOrigin(route.params.origin)
  }

  const icons = useMemo(() => {
    const icns = [{ iconComponent: <HelpIcon />, onPress: showHelp }]
    if (deletable) {
      icns[1] = {
        iconComponent: <DeleteIcon />,
        onPress: deletePaymentMethod,
      }
    }
    return icns
  }, [deletable, deletePaymentMethod, showHelp])

  useHeaderSetup({
    title: event.shortName,
    icons,
  })

  return { event, openLink, deletable, addToPaymentMethods }
}
