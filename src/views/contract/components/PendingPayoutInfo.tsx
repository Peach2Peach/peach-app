import { View } from 'react-native'
import { IconType } from '../../../assets/icons'
import { Divider } from '../../../components'
import {
  AddressSummaryItem,
  AmountSummaryItem,
  TextSummaryItem,
  TimerSummaryItem,
} from '../../../components/summaryItem'
import { useShowHelp } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useContractContext } from '../context'
import { TogglePayoutPending } from './TogglePayoutPending'

export const PendingPayoutInfo = () => {
  const { amount, releaseAddress, batchInfo } = useContractContext().contract
  const showHelp = useShowHelp('payoutPending')
  const etaProps = {
    title: i18n('batching.eta'),
    iconId: 'helpCircle' as IconType,
    iconColor: tw`text-info-main`.color,
    onPress: showHelp,
  }
  if (!batchInfo) return <></>
  return (
    <View style={tw`gap-4 justify-center`}>
      <Divider text={i18n('offer.requiredAction.payoutPending')} />
      <AmountSummaryItem amount={amount} />
      <AddressSummaryItem title={i18n('batching.willBeSenTTo')} address={releaseAddress} />
      {batchInfo.timeRemaining === -2 ? (
        <TextSummaryItem text={i18n('batching.eta.tba')} {...etaProps} />
      ) : (
        <TimerSummaryItem {...etaProps} end={Date.now() + batchInfo.timeRemaining * 1000} />
      )}
      <TextSummaryItem title={i18n('batching.slots')} text={`${batchInfo.participants}/${batchInfo.maxParticipants}`} />
      <View style={tw`flex-row flex-wrap justify-start gap-2 mt-6px`}>
        <TogglePayoutPending />
      </View>
    </View>
  )
}
