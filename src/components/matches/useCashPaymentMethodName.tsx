import { useMeetupEvents } from '../../hooks/query/useMeetupEvents'

export const useCashPaymentMethodName = (paymentMethod: `cash.${string}`) => {
  const eventId = paymentMethod.replace('cash.', '')
  const { data: meetupEvents } = useMeetupEvents()
  return meetupEvents?.find(({ id }) => id === eventId)?.shortName ?? eventId
}
