import { View } from 'react-native'
import { AddressSummaryItem, TextSummaryItem, TimerSummaryItem } from '../../../components/summaryItem'
import { useShowHelp } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useContractContext } from '../context'

export const PendingPayoutInfo = () => {
  const { releaseAddress, batchInfo } = useContractContext().contract
  const showHelp = useShowHelp('payoutPending')
  const etaProps = {
    title: i18n('batching.eta'),
    iconId: 'helpCircle' as const,
    iconColor: tw`text-info-main`.color,
    onPress: showHelp,
  }
  if (!batchInfo) return <></>
  const { timeRemaining, participants, maxParticipants } = batchInfo
  return (
    <View style={tw`justify-center gap-4 grow`}>
      <AddressSummaryItem title={i18n('batching.willBeSenTTo')} address={releaseAddress} />
      {timeRemaining === -2 ? (
        <TextSummaryItem text={i18n('batching.eta.tba')} {...etaProps} />
      ) : (
        <TimerSummaryItem {...etaProps} end={Date.now() + timeRemaining * 1000} />
      )}
      <TextSummaryItem title={i18n('batching.slots')} text={`${participants}/${maxParticipants}`} />
    </View>
  )
}
