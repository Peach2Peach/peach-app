import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { useMeetupEventsStore } from '../../../store/meetupEventsStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Text } from '../../text'

declare type CashTradesDetailsProps = {
  contract: Contract
}

export const CashTradeDetails = ({ contract }: CashTradesDetailsProps): ReactElement => {
  const getMeetupEvent = useMeetupEventsStore((state) => state.getMeetupEvent)
  const meetupEvent = getMeetupEvent(contract.paymentMethod.replace('cash.', ''))

  return (
    <View style={tw`flex-row items-start justify-between mt-4`}>
      <Text style={tw`text-black-2`}>{i18n('contract.payment.to')}</Text>
      <View style={tw`flex-row items-center`}>
        <Text style={tw`ml-4 leading-normal text-right subtitle-1`}>
          {meetupEvent?.shortName + ` ${i18n('contract.summary.in')} ` + meetupEvent?.city}
        </Text>
      </View>
    </View>
  )
}
