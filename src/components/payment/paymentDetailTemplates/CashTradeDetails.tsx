import { useMeetupEventsStore } from '../../../store/meetupEventsStore'
import i18n from '../../../utils/i18n'
import { PaymentTemplateProps } from './GeneralPaymentDetails'
import { InfoBlock } from './InfoBlock'

export const CashTradeDetails = ({ paymentMethod, disputeActive }: PaymentTemplateProps) => {
  const getMeetupEvent = useMeetupEventsStore((state) => state.getMeetupEvent)
  const meetupEvent = getMeetupEvent(paymentMethod.replace('cash.', ''))

  return (
    <InfoBlock
      value={meetupEvent?.shortName + ` ${i18n('contract.summary.in')} ` + meetupEvent?.city}
      name={'contract.payment.to'}
      copyable={false}
      disputeActive={disputeActive}
    />
  )
}
