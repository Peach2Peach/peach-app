import { ReactElement } from 'react';
import { useMeetupEventsStore } from '../../../store/meetupEventsStore'
import i18n from '../../../utils/i18n'
import { InfoBlock } from './generalPaymentDetails'

declare type CashTradesDetailsProps = {
  contract: Contract
}

export const CashTradeDetails = ({ contract }: CashTradesDetailsProps): ReactElement => {
  const getMeetupEvent = useMeetupEventsStore((state) => state.getMeetupEvent)
  const meetupEvent = getMeetupEvent(contract.paymentMethod.replace('cash.', ''))

  return (
    <InfoBlock
      value={meetupEvent?.shortName + ` ${i18n('contract.summary.in')} ` + meetupEvent?.city}
      name={'contract.payment.to'}
      copyable={false} />
  )
}
